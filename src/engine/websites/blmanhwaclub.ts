// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './blmanhwaclub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/blmanhwa\.club\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('blmanhwaclub', 'BL Manhwa Club', 'https://blmanhwa.club'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class blmanhwaclub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'blmanhwaclub';
        super.label = 'BL Manhwa Club';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://blmanhwa.club';
    }
}
*/