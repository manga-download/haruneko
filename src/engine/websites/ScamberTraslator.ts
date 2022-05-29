// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ScamberTraslator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/scambertraslator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scambertraslator', 'ScamberTraslator', 'https://scambertraslator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScamberTraslator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'scambertraslator';
        super.label = 'ScamberTraslator';
        this.tags = [ 'webtoon', 'spanish', 'scanlation' ];
        this.url = 'https://scambertraslator.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/