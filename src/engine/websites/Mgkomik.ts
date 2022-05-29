// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Mgkomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mgkomik\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mgkomik', 'MGKOMIK', 'https://mgkomik.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mgkomik extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mgkomik';
        super.label = 'MGKOMIK';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://mgkomik.com';
    }
}
*/