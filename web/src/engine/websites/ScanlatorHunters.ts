// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ScanlatorHunters.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/scanlatorhunters\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanlatorhunters', 'Scanlator Hunters', 'https://scanlatorhunters.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ScanlatorHunters extends WordPressMadara {

    constructor() {
        super();
        super.id = 'scanlatorhunters';
        super.label = 'Scanlator Hunters';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://scanlatorhunters.com';
    }
}
*/