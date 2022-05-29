// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GDScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gdscan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gdscans', 'GD Scans', 'https://gdscan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GDScans extends WordPressMadara {
    constructor() {
        super();
        super.id = 'gdscans';
        super.label = 'GD Scans';
        this.tags = [ 'manga', 'scanlation', 'english' ];
        this.url = 'https://gdscan.xyz';
    }
}
*/