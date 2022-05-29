// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TonizuToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tonizutoon\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tonizutoon', 'Tonizu Toon', 'https://tonizutoon.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TonizuToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tonizutoon';
        super.label = 'Tonizu Toon';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://tonizutoon.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/