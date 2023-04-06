// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PrismaScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/prismascans\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('prismascans', 'Prisma Scan', 'https://prismascans.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PrismaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'prismascans';
        super.label = 'Prisma Scan';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://prismascans.net';
    }
}
*/