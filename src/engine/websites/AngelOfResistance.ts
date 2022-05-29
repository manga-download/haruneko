// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AngelOfResistance.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/angelofresistance-tr\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('angelofresistance', 'Angel Of Resistance (AOR-TR)', 'https://angelofresistance-tr.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AngelOfResistance extends WordPressMadara {

    constructor() {
        super();
        super.id = 'angelofresistance';
        super.label = 'Angel Of Resistance (AOR-TR)';
        this.tags = [ 'manga', 'webtoon', 'turkish'];
        this.url = 'https://angelofresistance-tr.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/