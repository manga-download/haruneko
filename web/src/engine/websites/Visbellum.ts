// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Visbellum.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/visbellum\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('visbellum', 'Visbellum', 'https://visbellum.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Visbellum extends WordPressMadara {

    constructor() {
        super();
        super.id = 'visbellum';
        super.label = 'Visbellum';
        this.tags = [ 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://visbellum.com';
    }
}
*/