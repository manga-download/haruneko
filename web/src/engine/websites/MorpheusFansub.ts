// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MorpheusFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/morpheus\.animemangabilgileri\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('morpheusfansub', 'Morpheus Fansub', 'https://morpheus.animemangabilgileri.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MorpheusFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'morpheusfansub';
        super.label = 'Morpheus Fansub';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://morpheus.animemangabilgileri.com';

        this.queryTitleForURI = 'div.profile-manga div.post-title h1';
    }
}
*/