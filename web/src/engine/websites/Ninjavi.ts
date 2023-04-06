// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Ninjavi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ninjavi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninjavi', 'NINJAVI', 'https://ninjavi.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Ninjavi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ninjavi';
        super.label = 'NINJAVI';
        this.tags = [ 'manga', 'webtoon', 'arabic' ];
        this.url = 'https://ninjavi.com';
    }
}
*/