// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PrismaHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/prismahentai\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('prismahentai', 'Prisma Hentai', 'https://prismahentai.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PrismaHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'prismahentai';
        super.label = 'Prisma Hentai';
        this.tags = [ 'hentai', 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://prismahentai.com';
    }
}
*/