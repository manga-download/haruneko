// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './BlackDragonsFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/bdsfansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bdsfansub', 'Black Dragons no Fansub', 'https://bdsfansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BlackDragonsFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'bdsfansub';
        super.label = 'Black Dragons no Fansub';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://bdsfansub.com';
    }
}
*/