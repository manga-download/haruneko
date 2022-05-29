// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GetManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/getmanhwa\.co\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('getmanhwa', 'GetManhwa', 'https://getmanhwa.co'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GetManhwa extends WordPressMadara {

    constructor() {
        super();
        super.id = 'getmanhwa';
        super.label = 'GetManhwa';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://getmanhwa.co';
    }
}
*/