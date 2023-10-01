import { Tags } from '../Tags';
import icon from './PairOfTwo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve, reject) => {
        const pages = [...document.querySelectorAll('div.swiper-slide img')].map(image=> image.src);
        resolve(pages);
    })
`;

function MangaExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('h2').getAttribute('title').trim()
    };
}

@Common.MangaCSS(/^https?:\/\/po2scans\.com\/series\/[^/]+$/, 'div.series-information div.title')
@Common.MangasSinglePageCSS('/series', 'div.series-list', MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chap-section div.chap a')
@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pairoftwo', 'Pair of 2', 'https://po2scans.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}