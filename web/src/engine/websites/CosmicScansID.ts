import { Tags } from '../Tags';
import icon from './CosmicScansID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Common.MangasMultiPageCSS('/page/{page}/', 'div.bixbox div.listupd div.utao div.imgu a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageElement()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cosmicscansid', 'Cosmic Scans ID', 'https://cosmicscans.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}