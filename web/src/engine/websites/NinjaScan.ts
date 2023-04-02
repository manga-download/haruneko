// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NinjaScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ninjascan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ninjascan', 'Ninja Scan', 'https://ninjascan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NinjaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ninjascan';
        super.label = 'Ninja Scan';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://ninjascan.xyz';
    }
}
*/