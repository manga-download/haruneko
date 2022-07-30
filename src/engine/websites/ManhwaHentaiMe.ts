// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhwaHentaiMe.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwahentai\.me\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwahentaime', 'ManhwaHentai.me', 'https://manhwahentai.me'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaHentaiMe extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhwahentaime';
        super.label = 'ManhwaHentai.me';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://manhwahentai.me';

        this.queryPages = 'div.page-break source';
    }
}
*/