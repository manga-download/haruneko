import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as PeachScan from './decorators/PeachScan';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, PeachScan.queryMangaTitleFromURI)
@Common.MangasSinglePagesCSS([PeachScan.mangaPath], PeachScan.queryMangas)
@Common.ChaptersSinglePageCSS(PeachScan.queryChapters, PeachScan.ChapterExtractor)
@PeachScan.PagesFromZips()
@PeachScan.ImageFromZip()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sinensisscan', 'Sinensis Scans', 'https://sinensis.leitorweb.com', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}