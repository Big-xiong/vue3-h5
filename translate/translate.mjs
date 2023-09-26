/* eslint-disable */
import $ from 'gogocode';
import fs from 'fs';
import glob from 'glob';
import { translateText, getKeyJson, detectLangsFolder } from '@aagames-fe/google-translate/utils/index.mjs';
import path from 'path';

// const args = clArgs([
//     {
//         name: 'langFolder',
//         alias: 'l',
//         type: String,
//         defaultOptions: true,
//         defaultValue: '../public/language/*.mjs'
//     },
//     {
//         name: 'key',
//         alias: 'k',
//         type: String,
//         defaultOptions: true,
//         defaultValue: path.resolve('./key.json')
//     },
//     {
//         name: 'langs',
//         type: String,
//         multiple: true,
//         defaultValue: ['en', 'vi', 'th'],
//     },
//     {
//         name: 'help',
//         alias: 'h',
//         type: Boolean,
//     },
// ]);

const args = {
    langFolder: '../native-sports/i18n/*.mjs',
    key: '../key.json',
    langs: ['en', 'vi', 'th']
}

let langFolder = '';
let isLangsESM = false;

(async () => {
    if (args.help) {
        console.log('-l string 使用-l指定语言文件目录,比如: ../src/i18n/*.js');
        console.log('-langs [string] 使用-langs指定要翻译的语种,比如: -langs en vi th');
        console.log('-k string 使用-k指定谷歌鉴权json,如果不传默认生成一个。比如: ./key.json');
        return
    }

    if (!args.langFolder) {
        const result = await detectLangsFolder(args.langs)
        if (!result) {
            throw new Error('自动检测语言目录失败，请使用 -l 参数手动指定语言目录')
        }
        langFolder = result.folder
        isLangsESM = result.isESM
    } else {
        langFolder = args.langFolder
    }

    await getKeyJson(args.key);

    const localMap = new Set();
    let enLocale = null;

    const isZh = (str) => /[\u4E00-\u9FA5]/gi.test(str);
    const is3m = (str) => /[a-z]+[ =|\d|\w|'|"|`]+\?.*:/gi.test(str.trim()
        .replace(/\n| /g, ''));

    const strConfig = [
        ['{{$t(`', '`)}}'],
        ['$t(\'', '\')'],
        ['$t("', '")'],
        ['$t(`', '`)']
    ];

    const strFormat = (str) => {
        const target = strConfig.find((child) => str.startsWith(child[0]));
        if (target) {
            const formatStr = str.replace(target[0], '')
                .replace(target[1], '');
            if (isZh(str) && !enLocale[formatStr]) localMap.add(formatStr);
        }
        return !!target;
    };

    const zhReg = /(?<=[{{|}}|`|'|"]?)((?:(?![{{|}}||'|"|`]).)*)/gi;

    const getZh = (str) => {
        // const wrapStr = str.match(/(?<={{[ ]?)(.*)(?=[ ]?}})/gi)
        let result = str;
        const newStr = result.startsWith('{{') && str.endsWith('}}') ? result.substr(2, result.length - 4) : result;
        if (is3m(newStr)) {
            // result = newStr.match(/((?:(?!['|"|`|{|}]).)*)/gi).filter(isZh);
            result = newStr.match(/(\$t\(['|"|`].*?['|"|`]\))|((?:(?![{} ? "'` : ]).)*)/g)
                .filter(isZh);
        } else {
            // 判断$t开头，并有参数
            if (/['|"|`], ?\[/gi.test(result)) {
                result = result.match(/(?<=['|"|`])(.*?)(?=['|"|`])/gi);
            } else {
                result = result.match(/(?<=[{{|}}|`|'|"]?)((?:(?![{{|}}]).)*)/gi);
            }
        }
        result
            ?.filter((item) => isZh(item))
            ?.filter((item) => {
                if (strFormat(item)) {
                    return false;
                } else {
                    // 判断三元表达式
                    if (is3m(item)) {
                        if (
                            item
                                .match(/((?:(?!['|"|`]).)*)/gi)
                                ?.map(strFormat)
                                .every(Boolean)
                        ) {
                            return false;
                        }
                    } else if (!enLocale[item]) {
                        localMap.add(item);
                    }
                }
                return true;
            })
            .map((item) => {
                if (is3m(item)) {
                    return item.match(/((?:(?!['|"|`]).)*)/gi)
                        ?.filter((s) => isZh(s));
                }
                return item;
            }) ?? [];
        return [].concat(...result.filter(Boolean)
            .filter((item) => isZh(item)));
    };

    const replaceAll = (find, replace, str) => {
        var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        return str.replace(new RegExp(find, 'g'), replace);
    };

    const excludeFiles = [];

    glob('../native-sports/**/*.vue', async (err, files) => {
        if (!enLocale) {
            const enFile = glob.sync(langFolder.replace('*', 'en'));
            enLocale = (await import(enFile[0])).default;
        }
        files
            .filter((file) => !excludeFiles.some((path) => file.includes(path)))
            .forEach(async (file) => {
                // if (!file.includes('Newst.vue')) return;
                // if (!file.includes('App.vue')) return;
                // if (!file.includes('popularize-link/index.vue')) return;
                await transform(file);
            });
        await glob('../native-sports/**/*.js', async (err, jsFiles) => {
            const zhMaps = new Set();
            jsFiles.forEach((file) => {
                const ast = $.loadFile(file);
                ast.find?.(`'$_$'`)
                    ?.each((item) => {
                        if (item.parent(1)
                            .attr('callee.object.name') !== 'console') {
                            const target = item['0'].match['0'].map((child) => child.value)
                                .filter(isZh);
                            if (target.length) {
                                zhMaps.add(...target);
                            }
                        }
                    });
            });
            const enMap = [...Object.keys(enLocale), ...localMap];
            [...zhMaps].forEach((item) => {
                if (!enMap.includes(item)) {
                    localMap.add(item);
                }
            });
            if (!localMap.size) return;

            // 获取翻译文件循环翻译
            // 翻译阈值，设置过大会触发并发报错
            const total = 200;
            await glob(langFolder, (err, files) => {
                files
                    .filter(file => {
                        const suffix = file.split('/')
                            .pop()
                            .split('.')
                            .shift();
                        return args.langs.includes(suffix);
                    })
                    .filter(item => !item.includes('vant'))
                    .forEach(async (file) => {

                        let targetLocale = enLocale;
                        const suffix = file.split('/')
                            .pop()
                            .split('.')
                            .shift();
                        try {
                            if (suffix !== 'en') {
                                const targetFile = await import(file);
                                targetLocale = targetFile.default;
                            }
                        } catch (error) {
                        }
                        const temp =
                            suffix === 'en' || (targetLocale && Object.keys(targetLocale).length)
                                ? [...localMap]
                                : [...Object.keys(enLocale), ...localMap];

                        const objs = [];
                        let num = 0;
                        let shift = null;
                        while ((shift = temp.shift())) {
                            shift = replaceAll('\n', '', shift);
                            if (!Array.isArray(objs[num])) {
                                objs[num] = [shift];
                            } else {
                                objs[num].push(shift);
                            }
                            if (objs[num].length % total === 0) {
                                num += 1;
                            }
                        }
                        await writeFile(file, suffix, objs, targetLocale ?? {});
                    });
            });
        });
    });

    let count = 0;

    function writeFile(path, to, objs = [], defaultLocal = {}) {
        if (!objs.length) {
            console.log(`${to} 语种文件没有需要翻译的内容`);
            return;
        }
        const map = {};
        return Promise.all(
            objs.map((str) => {
                count += str.length;
                return translateText(str.join('\n'), to)
                    .then((res) => {
                        // map[text] = res[0].toUpperCase() + res.slice(1);
                        const result = res.split('\n');
                        str.forEach((s, i) => {
                            const item = result[i];
                            map[s] = item[0].toUpperCase() + item.slice(1);
                        });
                    })
                    .catch((err) => {
                        console.log(str);
                        console.error(err);
                    });
            }
            )
        )
            .then(() => {
                const prefix = !isLangsESM ? 'export default ' : 'module.exports = ';
                fs.writeFileSync(path, `${prefix}${JSON.stringify({ ...defaultLocal, ...map }, undefined, 2)};`);
                // console.log(`${target} 语种翻译完毕，一共 ${objs.length} 条`);
            });
    }

    function format(item, type) {
        let str = '';
        switch (type) {
            case 'template':
                // template content
                str = item.match.replace(/\n|\s/g, '');
                break;
            case 'script':
            case 'script-setup':
                str = item.match?.[0]?.[0]?.value;
                if (item.parent(1)
                    .attr('callee.property.name') === '$t') {
                    getZh(str);
                    return;
                }
                break;
            default:
                // template attribute
                if ([':class', ':style', '@', 'v-'].some((c) => item.key.content.startsWith(c))) return;
                str = item.value.content;
        }
        getZh(str)
            .forEach((c, index) => {
                let current;
                const matchIndexes = [];
                const regex = new RegExp(`${c}`, 'g');
                while ((current = regex.exec(str)) != null) {
                    matchIndexes.push(current.index);
                }
                switch (type) {
                    case 'template':
                        // template content
                        if (str.startsWith('{{') && str.endsWith('}}')) {
                            if (!c.startsWith('$t(') && str.substr(matchIndexes[index] - 4, 2) !== '$t') {
                                if (matchIndexes.length > 1) {
                                    str = str.split('');
                                    str.splice(matchIndexes[index] - 1, c.length + 2, `$t('${c}')`);
                                    str = str.join('');
                                } else {
                                    if (str.substr(matchIndexes[0] - 4, 2) !== '$t') {
                                        const reg = new RegExp(`['|"|\`"]?(${c})['|"|\`"]?`, 'g');
                                        str = str.replace(reg, `$t('${c}')`);
                                    }
                                }
                            }
                        } else if (!c.startsWith('$t(')) {
                            const regex = new RegExp(`['|"|\`]${c}['|"|\`]`, 'g');
                            if (regex.test(str)) {
                                str = str.replace(regex, `$t('${c}')`);
                            } else {
                                str = str.replace(c, `{{ $t('${c}') }}`);
                            }
                        }
                        // fs.writeFileSync(`../log/test.txt`, `-----------------------\n${str}}\n-----------------------\n`, { flag: 'a+' });
                        // item.value.content.value.content = str;
                        item.replaceBy(str);
                        break;
                    case 'script':
                    case 'script-setup':
                        const parentAttrName = item.parent(1)
                            .attr('callee')?.callee?.name;
                        if (parentAttrName !== 'inject') {
                            const prefix = type === 'script' ? 'this.$t' : `$t`;
                            str = str.replace(c, `${prefix}(\'${c}\')`);
                            item.replaceBy(str);
                        }
                        break;
                    default:
                        // template attribute
                        if (!item.key.content.startsWith(':')) {
                            item.key.content = `:${item.key.content}`;
                        }
                        if (!c.startsWith('$t(') && str.substr(matchIndexes[index] - 4, 2) !== '$t') {
                            if (matchIndexes.length > 1) {
                                str = str.split('');
                                str.splice(matchIndexes[index] - 1, c.length + 2, `$t('${c}')`);
                                str = str.join('');
                            } else {
                                const reg = new RegExp(`['|"|\`"]?(${c})['|"|\`"]?`, 'g');
                                str = str.replace(reg, `$t('${c}')`);
                            }
                            item.value.content = str;
                        }
                }
            });
    }

    let size = 0;

    async function transform(file) {
        size = localMap.size;
        let codeString = fs.readFileSync(file, 'utf8')
            .toString();
        codeString = codeString.replace(/import.meta.env/g, 'IMPORT.meta.env');
        codeString = codeString.replace(/import.meta.glob/g, 'IMPORT.meta.glob');
        let sfcAst = $(codeString, {
            parseOptions: {
                language: 'vue'
            }
        });

        // 标签筛选
        sfcAst = sfcAst
            .find('<template></template>')
            .find(`<$_$1 $$$></$_$1>`)
            .each((item) => {
                item.match.$$$$.filter((c) => isZh(c?.value?.content))
                    .forEach(format);
            });

        let isScriptFy = false;

        // 内容筛选
        sfcAst = sfcAst
            .root()
            .find('<template></template>')
            .find('$_$')
            .each((item) => {
                if (isZh(item.match)) {
                    isScriptFy = true;
                    format(item, 'template');
                }
            });

        // script setup vue3 内容筛选
        sfcAst = sfcAst
            .root()
            .find('<script setup></script>')
            .find(['`$_$`', '\'$_$\''])
            .each((item) => {
                const target = item.match?.[0]?.[0];
                if (!item.parent(1)
                    .attr('callee.property.name') === '$t' && !isScriptFy) {
                    isScriptFy = true;
                }
                if (isZh(target?.value)) {
                    format(item, 'script-setup');
                }
            });

        // script vue2 内容筛选
        sfcAst = sfcAst
            .root()
            .find('<script></script>')
            .find(['`$_$`', '\'$_$\''])
            .each((item) => {
                const target = item.match?.[0]?.[0];
                isScriptFy = false;
                if (isZh(target?.value)) {
                    format(item, 'script');
                }
            });

        // 判断字典是否有新增翻译
        const whetherWrite = localMap.size > size;
        // if (whetherWrite) {
        // if (isScriptFy) {
        // 判断页面中是否存在import vue
        const isImpVue = !!sfcAst.root()
            .find('<script setup></script>')
            .find(`import { $$$ } from 'vue'`).length;
        if (!isImpVue) {
            sfcAst = sfcAst.root()
                .find('<script setup></script>')
                .prepend(`import { inject } from 'vue';
    const global = inject('global');
    ;`);
        }

        // 判断vue包是否引入 inject
        const isImpInject = !!sfcAst.root()
            .find('<script setup></script>')
            .find(`import { inject, $$$ } from 'vue'`).length;
        if (!isImpInject) {
            sfcAst = sfcAst
                .root()
                .find('<script setup></script>')
                .replace(`import { $$$ } from 'vue'`, `import { inject, $$$ } from 'vue'`)
                .prepend(`const global = inject('global');`);
        }

        // 判断是否声明global
        const isConstGlobal = !!sfcAst.root()
            .find('<script setup></script>')
            .find(`const $_$1 = inject('global')`).length;
        if (!isConstGlobal) {
            sfcAst = sfcAst.root()
                .find('<script setup></script>')
                .prepend(`const global = inject('global');`);
        }
        // }

        sfcAst = sfcAst.root()
            .generate();

        // $.writeFile(sfcAst, file);
        codeString = fs.readFileSync(file, 'utf8')
            .toString();
        codeString = codeString.replace(/IMPORT.meta.env/g, 'import.meta.env');
        codeString = codeString.replace(/IMPORT.meta.glob/g, 'import.meta.glob');
        // fs.writeFileSync(file, codeString);
        // }
        return Promise.resolve();
    }
})()
