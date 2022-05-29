// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CopyPasteScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/copypastescan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('copypastescan', 'Copy & Paste Scan', 'https://copypastescan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CopyPasteScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'copypastescan';
        super.label = 'Copy & Paste Scan';
        this.tags = [ 'manga', 'webtoon', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://copypastescan.xyz';
    }
}
*/