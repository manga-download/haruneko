import { Tags } from '../Tags';
import icon from './VyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div.comic-title').textContent.trim()
    };
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.href,
        title: anchor.querySelector('span').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.div-manga h1.title')
@Common.MangasMultiPageCSS('/search?page={page}', 'div.comic-item > a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.div-chapter div.list-group a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.carousel-item[data-page] img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vymanga', 'VyManga', 'https://vyvymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}