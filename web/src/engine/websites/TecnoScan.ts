// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TecnoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tecnoscann\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tecnoscan', 'Tecno Scan', 'https://tecnoscann.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TecnoScan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tecnoscan';
        super.label = 'Tecno Scan';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://tecnoscann.com';
    }
}
*/