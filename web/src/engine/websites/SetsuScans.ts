// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SetsuScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/setsuscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('setsuscans', 'SetsuScans', 'https://setsuscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SetsuScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'setsuscans';
        super.label = 'SetsuScans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://setsuscans.com';
    }
}
*/