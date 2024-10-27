import { Tags } from '../Tags';
import icon from './HikariScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hikariscan', 'Hikari Scan', 'https://hikariscan.org', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}