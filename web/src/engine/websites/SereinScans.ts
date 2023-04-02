// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SereinScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sereinscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sereinscans', 'Serein Scans', 'https://sereinscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SereinScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sereinscans';
        super.label = 'Serein Scans';
        this.tags = [ 'webtoon', 'turkish' ];
        this.url = 'https://sereinscans.com';
    }
}
*/