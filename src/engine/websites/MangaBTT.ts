import { Tags } from '../Tags';
import icon from './MangaBTT.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, MojoPortalComic.MangasLinkGenerator)
@Common.PagesSinglePageCSS('div.page-chapter img[data-index]:not([src$="/top.jpg"]):not([src$=".gif"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabtt', 'MangaBTT', 'https://manhwabtt.cc', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/Story/ListChapterByStoryID?StoryID=${manga.Identifier.split('-').at(-1)}`, this.URI));
        const chapters = await FetchCSS<HTMLAnchorElement>(request, MojoPortalComic.queryChapters);
        return chapters.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }
}