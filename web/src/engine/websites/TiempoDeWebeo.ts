// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TiempoDeWebeo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tiempodewebeo\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tiempodewebeo', 'Tiempo de Webeo', 'https://tiempodewebeo.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TiempoDeWebeo extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tiempodewebeo';
        super.label = 'Tiempo de Webeo';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://tiempodewebeo.com';
    }
}
*/