// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Helllunatoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hellunatoon\.fun\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('helllunatoon', 'Helllunatoon', 'https://hellunatoon.fun'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Helllunatoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'helllunatoon';
        super.label = 'Helllunatoon';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://hellunatoon.fun';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/