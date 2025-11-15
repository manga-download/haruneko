import { Tags } from '../Tags';
import icon from './Anisamanga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.manga-details div.title h1')
@Common.MangasMultiPageCSS('div.chapter-box div.title a', Common.PatternLinkGenerator('/page/{page}/?s'))
@Common.ChaptersSinglePageCSS('div.chapter-list ul li a', undefined, ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-images div.chapter-item img.wp-post-image')
@Common.ImageAjax(undefined, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anisamanga', 'Anisa Manga', 'https://anisamanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}