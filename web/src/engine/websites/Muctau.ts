// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Muctau.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/muctau\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('muctau', 'Muctau', 'https://muctau.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Muctau extends WordPressMadara {

    constructor() {
        super();
        super.id = 'muctau';
        super.label = 'Muctau';
        this.tags = ['webtoon', 'english', ];
        this.url = 'https://muctau.com';
    }
}
*/