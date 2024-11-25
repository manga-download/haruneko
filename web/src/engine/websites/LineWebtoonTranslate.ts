import { Tags } from '../Tags';
import icon from './LineWebtoonTranslate.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { LineWebtoonBase } from './templates/LineWebtoonBase';

const pageScript = `
       new Promise(resolve => {
           const pages = [...document.querySelectorAll('div.viewer div.viewer_lst div.viewer_img div.img_info')].map(page => {
               const cover = page.querySelector('img');
               return {
                   width: cover.width,
                   height: cover.height,
                   background: {
                       image: cover.src,
                   },
                   layers: [...page.querySelectorAll('span.ly_img_text')].map(layer => {
                       const image = layer.querySelector('img');
                       return {
                           type: 'image|text',
                           asset: image.src,
                           top: parseInt(layer.style.top),
                           left: parseInt(layer.style.left),
                           effects: {}
                       };
                   })
               };
           });
           resolve(pages);
       })
`;
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + anchor.search;
    let title = anchor.querySelector('div.info_area p.subj').textContent.trim();
    const language = anchor.querySelector('div.info_area span.country_txt').textContent.trim();
    title = `${title} - ${language} Fan Translation`;
    return { id, title };
}

@Common.MangasMultiPageCSS('?page={page}', 'div.work_wrap ul.work_lst > li > a', 1, 1, 0, MangaExtractor)
export default class extends LineWebtoonBase {
    public constructor() {
        super('linewebtoon-translate', `Line Webtoon (Translate)`, 'https://translate.webtoons.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
        this.languageRegexp = /language=(\w{3})/;
        this.mangaRegexp = /\/webtoonVersion\?webtoonNo=\d+&language=[^/]+&teamVersion=\d+$/;
        this.pageScript = pageScript;
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('needCCPA', 'false');window.cookieStore.set('pagGDPR', 'true');`);
    }

}