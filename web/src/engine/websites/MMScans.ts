// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MMScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mm-scans\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mmscans', 'MMSCANS', 'https://mm-scans.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MMScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mmscans';
        super.label = 'MMSCANS';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mm-scans.org';
    }
}
*/