// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DropeScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/dropescan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dropescan', 'Drope Scan', 'https://dropescan.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DropeScan extends WordPressMadara {
    constructor() {
        super();
        super.id = 'dropescan';
        super.label = 'Drope Scan';
        this.tags = [ 'manga', 'portuguese', 'scanlation' ];
        this.url = 'https://dropescan.com';
        this.language = 'pt';
    }
}
*/