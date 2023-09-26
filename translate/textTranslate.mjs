// import shell from "shelljs";
import fs from 'fs';
import glob from 'glob';
import clArgs from 'command-line-args';
import path from 'path';
import { translateText, getKeyJson, replaceAll, detectLangsFolder, getSuffix, importLocale } from './utils/index.mjs';

let langFolder = '';
let isLangsESM = false;
let enLocalePath = '';

(async () => {
    const args = clArgs([
        {
            name: 'file',
            alias: 'f',
            type: String,
        },
        {
            name: 'batch',
            alias: 'b',
            type: Number,
            defaultOptions: true,
            defaultValue: 50,
        },
        {
            name: 'str',
            alias: 's',
            type: String,
            multiple: true,
        },
        {
            name: 'langs',
            type: String,
            multiple: true,
            defaultOptions: true,
            defaultValue: ['en', 'vi', 'th'],
        },
        {
            name: 'help',
            alias: 'h',
            type: Boolean,
        },
        {
            name: 'langFolder',
            alias: 'l',
            type: String,
        },
        {
            name: 'key',
            alias: 'k',
            type: String,
            defaultOptions: true,
            defaultValue: path.resolve('./key.json'),
        },
    ]);

    if (args.help) {
        console.log('-f string 使用-f指定一个包含字符串数组的json文件，比如：-f ./test.json');
        console.log('-s string 使用-s指定翻译的字符串，可以输入多个比如: -s 测试1 测试2');
        console.log('-l string 使用-l指定语言文件目录,比如: ../src/i18n/*.js');
        console.log('-k string 使用-k指定谷歌鉴权json,如果不传默认生成一个。比如: ./key.json');
        return;
    }

    if (!args.langFolder) {
        const result = await detectLangsFolder(args.langs);
        if (!result) {
            throw new Error('自动检测语言目录失败，请使用 -l 参数手动指定语言目录');
        }
        langFolder = result.folder;
        isLangsESM = result.isESM;
        enLocalePath = result.enLocalePath;
    } else {
        langFolder = args.langFolder;
    }

    function writeFile(path, to, objs = [], defaultLocal = {}) {
        if (!objs.length) {
            console.log(`${to} 语种文件没有需要翻译的内容`);
            return;
        }
        const map = {};
        return Promise.all(
            objs.map(batchText =>
                translateText(batchText.join('\n'), to)
                    .then((res) => {
                        // map[text] = res[0].toUpperCase() + res.slice(1);
                        const result = res.split('\n');
                        batchText.forEach((s, i) => {
                            const item = result[i];
                            map[s] = item[0].toUpperCase() + item.slice(1);
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            )
        )
            .then(() => {
                const prefix = isLangsESM ? 'export default ' : 'module.exports = ';
                fs.writeFileSync(path, `${prefix}${JSON.stringify({ ...defaultLocal, ...map })};`);
                console.log(`${to} 语种翻译完毕，一共 ${objs.flat(1).length} 条`);
            });
    }

    await getKeyJson(args.key);

    let textToTranslate = [];
    if (args.file && fs.existsSync(path.resolve(args.file))) {
        try {
            const json = JSON.parse(fs.readFileSync(path.resolve(args.file))
                .toString());
            if (!Array.isArray(json)) {
                console.error('指定的文件必须是一个字符串数组');
            }
            textToTranslate = json;
        } catch (e) {
            throw new Error('指定的json文件不存在或者不是合法的json');
        }
    } else if (args.str) {
        textToTranslate = args.str;
    } else {
        console.error('请用-f指定json文件（包含字符串数组）或者用-s直接指定字符串或者字符串数组');
    }

    if (textToTranslate.length) {
        // const enFile = glob.sync(args.langFolder.replace('*', 'en'))
        let enLocale = null;
        // if (enFile.length) {
        glob(path.resolve(langFolder), (err, files) => {
            files
                .filter((file) => {
                    const suffix = getSuffix(file);
                    return args.langs.some((item) => suffix.includes(item));
                })
                .forEach(async (file) => {
                    const suffix = file.split('/')
                        .pop()
                        .split('.')
                        .shift();
                    // if (suffix !== 'zh-TW') return;
                    if (!enLocale) {
                        try {
                            enLocale = (await importLocale(enLocalePath))?.default ?? null;
                        } catch (e) {
                            console.log(e);
                            throw new Error(`无法找到英文语言文件：${langFolder}`);
                        }
                        // if (!enLocale) {
                        // }
                    }

                    let targetLocale = enLocale;
                    try {
                        if (suffix !== 'en') {
                            targetLocale = (await importLocale(file))?.default;
                        }
                    } catch (error) {
                    }

                    const temp = suffix === 'en' || (targetLocale && Object.keys(targetLocale).length)
                        ? [...textToTranslate]
                        : [...Object.keys(enLocale), ...textToTranslate];

                    const objs = [];

                    let num = 0;
                    let shift = null;
                    while ((shift = temp.shift())) {
                        shift = replaceAll('\n', '', shift);
                        const enTarget = enLocale[shift];
                        if (enTarget && targetLocale[shift]) {
                            continue;
                        }
                        if (!Array.isArray(objs[num])) {
                            objs[num] = [shift];
                        } else {
                            objs[num].push(shift);
                        }
                        if (objs[num].length % args.batch === 0) {
                            num += 1;
                        }
                    }

                    await writeFile(file, suffix, objs, targetLocale ?? {});
                });
        });
    }
})();
