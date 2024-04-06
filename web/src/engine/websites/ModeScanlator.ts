import { Tags } from '../Tags';
import icon from './ModeScanlator.webp';
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
        super('modescanlator', `Mode Scanlator`, 'https://modescanlator.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }
    public override get Icon() {
        return icon;
    }
}