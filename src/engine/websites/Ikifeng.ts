// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Ikifeng.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ikifeng\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikifeng', 'Ikifeng', 'https://ikifeng.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Ikifeng extends WordPressMadara {
    constructor() {
        super();
        super.id = "ikifeng";
        super.label = "Ikifeng";
        this.tags = ["manga", "webtoon", "hentai", "spanish"];
        this.url = "https://ikifeng.com";
    }

    canHandleURI(uri) {
        return /https?:\/\/ikifeng\.com/.test(uri.origin);
    }
}
*/