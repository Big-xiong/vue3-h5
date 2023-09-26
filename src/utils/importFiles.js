/* eslint-disable default-case */
import { i18n } from '@/init';

function replaceStr({
  arr, txt, type,
}) {
  arr.forEach((el) => {
    if (type === 'link') {
      const [title, link] = el.split(')[');
      if (title && link) {
        const str = `<a style="color: #2d64b3" href="${link.substr(0, link.length - 1)}">${title.substr(1)}</a>`;
        txt = txt.replace(el, str);
      }
    } else {
      const txtIndex = txt.indexOf(el);
      if (txtIndex !== -1) {
        let strTemp = txt.substr(txtIndex);
        const val = el.replace(/\*{2}/g, '');
        strTemp = strTemp.replace(el, `<b>${val}</b>`);
        txt = `${txt.substr(0, txtIndex)}${strTemp}`;
      }
    }
  });
  return txt;
}

export async function getSeoProtocol() {
  try {
    let res;
    switch (i18n.global.locale) {
      case 'zh-CN':
        res = await import(`/public/seo/footer/50001/zh-CN.txt?raw`);
        break;
      case 'en':
        res = await import(`/public/seo/footer/50001/en.txt?raw`);
        break;
      case 'th':
        res = await import(`/public/seo/footer/50001/th.txt?raw`);
        break;
      case 'vi':
        res = await import(`/public/seo/footer/50001/vi.txt?raw`);
        break;
    }
    let txt = res.default;
    // (link标题)[link地址] link效果
    const txtLinkMatches = txt.match(/\((.*?)\]/gm);
    txt = replaceStr({
      arr: txtLinkMatches, txt, type: 'link',
    });

    // -- xxx 高亮效果
    txt = txt.replace(/^--(.*)\n/gm, ($0) => `<span style="color: var(--theme-color)">${$0.replace('-- ', '')}</span>`);
    // ** xxx ** 加粗效果
    const txtWeightMatches = txt.match(/\*{2}(.*?)\*{2}/gm);
    txt = replaceStr({ arr: txtWeightMatches, txt, type: 'weight' });
    txt = txt.replace(/\n/g, '<br />');
    return Promise.resolve(txt);
    // return Promise.resolve(res.default);
  } catch (error) {

  }
}
