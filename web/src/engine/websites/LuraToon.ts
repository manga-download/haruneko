import { Tags } from '../Tags';
import icon from './LuraToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as PeachScan from './decorators/PeachScan';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, PeachScan.queryMangaTitleFromURI)
@Common.MangasSinglePageCSS(PeachScan.mangaPath, PeachScan.queryMangas)
@Common.ChaptersSinglePageCSS(PeachScan.queryChapters, PeachScan.ChapterExtractor)
@PeachScan.PagesFromZips()
@PeachScan.ImageFromZip()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('luratoon', 'Lura Toon', 'https://luratoons.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}