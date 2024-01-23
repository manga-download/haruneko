import { Tags } from '../Tags';
import icon from './ManhwasMen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

function MangaExtractorFromURI(element: HTMLElement) {
    return element.textContent.replace(/ raw$/i, '').trim();
}
function MangaExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.title').textContent.replace(/ raw$/i, '').trim();
    const id = anchor.pathname;
    return { id, title };
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('p span').textContent.trim();
    const id = anchor.pathname;
    return {id, title};

}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.title', MangaExtractorFromURI)
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'article.anime a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('ul.episodes-list li a', ChapterExtractor)
@MangaStream.PagesSinglePageCSS([/discord\.jpg/], 'div#chapter_imgs img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasmen', `Manhwas Men`, 'https://manhwas.men', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }
    public override get Icon() {
        return icon;
    }
}
