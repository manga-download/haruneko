// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Manhuaga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuaga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaga', 'Manhuaga', 'https://manhuaga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Manhuaga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuaga';
        super.label = 'Manhuaga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuaga.com';
    }
}
*/