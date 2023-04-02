// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './XXXYaoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/xxxyaoi\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xxxyaoi', 'XXXYaoi', 'https://xxxyaoi.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XXXYaoi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'xxxyaoi';
        super.label = 'XXXYaoi';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://xxxyaoi.com';
    }
}
*/