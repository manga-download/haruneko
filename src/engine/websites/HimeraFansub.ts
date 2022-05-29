// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HimeraFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/himera-fansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('himerafansub', 'Himera Fansub', 'https://himera-fansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HimeraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'himerafansub';
        super.label = 'Himera Fansub';
        this.tags = [ 'manga', 'webtoon', 'turkish'];
        this.url = 'https://himera-fansub.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/