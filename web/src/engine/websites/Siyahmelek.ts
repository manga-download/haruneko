// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Siyahmelek.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/siyahmelek\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('siyahmelek', 'Siyahmelek', 'https://siyahmelek.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Siyahmelek extends WordPressMadara {

    constructor() {
        super();
        super.id = 'siyahmelek';
        super.label = 'Siyahmelek';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://siyahmelek.com';
    }
}
*/