import { Tags } from '../Tags';
import icon from './AiinScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/aiinscan.xyz\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Aiin Scan"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('aiinscan', 'Aiin Scan', 'https://aiinscan.xyz', Tags.Media.Manga, Tags.Source.Scanlator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}