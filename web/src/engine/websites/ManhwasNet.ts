import { Tags } from '../Tags';
import icon from './ManhwasNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pagesScript = `[...document.querySelectorAll('div#chapter_imgs img[src]:not([src=""])')].map(image => image.src);`;
function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('h3.title').textContent.trim()
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('p span').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article.anime-single h1.title')
@Common.MangasMultiPageCSS('/biblioteca?page={page}', 'article.anime a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('li a.fa-book', ChapterExtractor)
@Common.PagesSinglePageJS(pagesScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasnet', 'Manhwas', 'https://manhwas.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}