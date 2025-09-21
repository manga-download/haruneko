import { Tags } from '../Tags';
import icon from './MangaRaw18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.queryMangas, Liliana.MangasLinkGenerator)
@Common.ChaptersSinglePageCSS('ul li div.chapter a')
@Liliana.PagesSinglePageJS(undefined, 'img', (element) => element.dataset.original)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaraw18', 'MangaRaw18', 'https://mangaraw18.net', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}