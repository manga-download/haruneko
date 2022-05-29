// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DropeScanSensainaYuri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sensainayuri\.dropescan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sensainayuri', 'Sensaina Yuri (Drope Scan)', 'https://sensainayuri.dropescan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DropeScanSensainaYuri extends WordPressMadara {
    constructor() {
        super();
        super.id = 'sensainayuri';
        super.label = 'Sensaina Yuri (Drope Scan)';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://sensainayuri.dropescan.com';
        this.language = 'pt';
    }
}
*/