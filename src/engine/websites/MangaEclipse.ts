import { Tags } from '../Tags';
import icon from './MangaEclipse.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Manga Eclipse"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaeclipse', 'Manga Eclipse', 'https://mangaeclipse.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}