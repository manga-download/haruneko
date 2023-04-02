// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './XunScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/xunscans\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xunscans', 'XuNScans', 'https://xunscans.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XunScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'xunscans';
        super.label = 'XuNScans';
        this.tags = [ 'manga', 'english', 'scanlation' ];
        this.url = 'https://xunscans.xyz';
    }
}
*/