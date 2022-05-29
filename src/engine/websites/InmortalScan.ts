// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './InmortalScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga\.mundodrama\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('inmortalscan', 'Inmortal Scan', 'https://manga.mundodrama.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class InmortalScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'inmortalscan';
        super.label = 'Inmortal Scan';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://manga.mundodrama.site';
    }
}
*/