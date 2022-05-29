// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AzoraWorld.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/azoraworld\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azoraworld', 'AzoraWorld', 'https://azoraworld.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AzoraWorld extends WordPressMadara {

    constructor() {
        super();
        super.id = 'azoraworld';
        super.label = 'AzoraWorld';
        this.tags = [ 'webtoon', 'arabic', 'manga' ];
        this.url = 'https://azoraworld.com';
    }
}
*/