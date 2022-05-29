// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GourmetScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gourmetscans\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gourmetscans', 'Gourmet Scans', 'https://gourmetscans.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GourmetScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'gourmetscans';
        super.label = 'Gourmet Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://gourmetscans.net';
    }
}
*/