import { Tags } from '../Tags';
import icon from './MangaRaw1001.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(Liliana.mangaPath, MojoPortalComic.queryMangas)
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters)
@Liliana.PagesSinglePageJS(undefined, 'div.page-chapter img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaraw1001', 'MangaRaw1001', 'https://mangaraw1001.cc', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}