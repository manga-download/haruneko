// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './HadesNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangareaderpro\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hadesnofansub', 'Hades No Fansub', 'https://mangareaderpro.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HadesNoFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'hadesnofansub';
        super.label = 'Hades No Fansub';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://mangareaderpro.com';
        this.path = '/es';
    }
}
*/