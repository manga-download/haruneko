import { Tags } from '../Tags';
import icon from './PieScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.manga-details div.title h1')
@Common.MangasMultiPageCSS('div.title a', Common.PatternLinkGenerator('/page/{page}/?s'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.chapter-list ul li a', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.title').textContent.trim() }))
@Common.PagesSinglePageCSS('div.chapter-images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('piescans', 'PieScans', 'https://piescans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}