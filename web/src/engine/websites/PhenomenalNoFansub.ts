// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PhenomenalNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/phenomenalnofansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('phenomenalnofansub', 'Phenomenal No Fansub', 'https://phenomenalnofansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PhenomenalNoFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'phenomenalnofansub';
        super.label = 'Phenomenal No Fansub';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://phenomenalnofansub.com';
    }
}
*/