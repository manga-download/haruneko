// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './YokaiJump.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/yokaijump\.fr\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yokaijump', 'Yokai Jump', 'https://yokaijump.fr'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YokaiJump extends WordPressMadara {

    constructor() {
        super();
        super.id = 'yokaijump';
        super.label = 'Yokai Jump';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://yokaijump.fr';
    }
}
*/