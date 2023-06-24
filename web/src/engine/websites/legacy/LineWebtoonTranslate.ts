import { Tags } from '../../Tags';
import icon from './LineWebtoonTranslate.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as LineW from '../decorators/LineWebtoon';
import { FetchRequest, FetchWindowScript } from '../../FetchProvider';

const pageScript = `
       new Promise(async resolve => {
                 let pages = [...document.querySelectorAll('div.viewer div.viewer_lst div.viewer_img div.img_info')].map(page => {
                            let cover = page.querySelector('img');
                            return {
                                background: {
                                    image: cover.src
                                },
                                layers: [...page.querySelectorAll('span.ly_img_text')].map(layer => {
                                    let image = layer.querySelector('img');
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
                        return;
                    })
                   
`;
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + anchor.search;
    let title = anchor.querySelector('div.info_area p.subj').textContent.trim();
    const language = anchor.querySelector('div.info_area span.country_txt').textContent.trim();
    title = `${title} - ${language} Fan Translation`;
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/translate\.webtoons\.com\/webtoonVersion\?webtoonNo=\d+&language=\S+&teamVersion=\d+$/, LineW.queryMangaTitleURI, Common.ElementLabelExtractor(), true)
@Common.MangasMultiPageCSS('?page={page}', 'div.work_wrap ul.work_lst > li > a',1,1,0, MangaExtractor)
@LineW.ChaptersMultiPageCSS()
@LineW.PagesSinglePageJS(pageScript)
@LineW.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('linewebtoon-translate', `Line Webtoon (Translate)`, 'https://translate.webtoons.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('needCCPA', 'false');window.cookieStore.set('pagGDPR', 'true');`);
    }

}