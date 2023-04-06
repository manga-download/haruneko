// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhwaFull.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwafull\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafull', 'ManhwaFull', 'https://manhwafull.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaFull extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwafull';
        super.label = 'ManhwaFull';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhwafull.com';
    }
}
*/