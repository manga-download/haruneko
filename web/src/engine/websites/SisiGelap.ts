// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SisiGelap.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/sisigelap\.club\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sisigelap', 'SISI GELAP', 'https://sisigelap.club'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SisiGelap extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sisigelap';
        super.label = 'SISI GELAP';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://sisigelap.club';
    }
}
*/