// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SodaScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sodascan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sodascan', 'Soda Scan', 'https://sodascan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SodaScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sodascan';
        super.label = 'Soda Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://sodascan.xyz';
    }
}
*/