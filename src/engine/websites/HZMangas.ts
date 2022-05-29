// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HZMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hzmangas\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hzmangas', 'Hz Manga', 'http://hzmangas.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HZMangas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hzmangas';
        super.label = 'Hz Manga';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'http://hzmangas.com';
    }
}
*/