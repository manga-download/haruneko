// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MiracleScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/miraclescans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('miraclescans', 'Miracle Scans', 'https://miraclescans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MiracleScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'miraclescans';
        super.label = 'Miracle Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://miraclescans.com';
    }
}
*/