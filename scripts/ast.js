import $ from 'gogocode';

const fileRegex = /\.(vue)$/;

export const transformTopLevelAwait = () => ({
  name: 'transformTopLevelAwait',
  transform(code, path, isServer) {
    try {
      if (fileRegex.test(path)
        && !['App.vue', 'Form/index.vue'].some((item) => path.includes(item))) {
        let isWrite = false;
        let codeString = code.replace(/import.meta.env/g, 'IMPORT.meta.env');
        const result = $(codeString, {
          parseOptions: {
            language: 'vue',
          },
        })
          .find('<script setup></script>')
          .find('await $_$')
          .each((item) => {
            const { value } = item[0].match[0][0];
            const { loc: { end: { line }, lines: { infos } } } = item.node.argument.callee;
            if (!infos[line - 2].line.trim().endsWith('{')) {
              isWrite = true;
              item.replaceBy(isServer ? `await ${value}` : value);
            }
          })
          .root()
          .generate();
        codeString = result.replace(/IMPORT.meta.env/g, 'import.meta.env');
        if (isWrite) {
          return {
            code: codeString,
          };
        }
      }
    } catch (e) {
      return {
        code,
      };
    }
  },
});
