import { Tags } from '../Tags';
import icon from './TitanManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.manga-details div.title h1')
@Common.MangasMultiPageCSS('/page/{page}/?s', 'div.search-posts div.title a')
@Common.ChaptersSinglePageCSS('ul.scroll li a', ChapterExtractor)
@Madara.PagesSinglePageCSS('div.chapter-images div.chapter-item img')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('titanmanga', 'Titan Manga', 'https://titanmanga.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}