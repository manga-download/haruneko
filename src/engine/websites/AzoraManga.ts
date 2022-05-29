// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AzoraManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/azoramanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azoramanga', 'أزورا مانج (AZORA MANGA)', 'https://azoramanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AzoraManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'azoramanga';
        super.label = 'أزورا مانج (AZORA MANGA)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://azoramanga.com';
    }
}
*/