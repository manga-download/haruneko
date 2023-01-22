// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaNeloTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manganeloteam\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganeloteam', 'Manga Nelo Team', 'https://manganeloteam.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manganeloteam';
        super.label = 'Manga Nelo Team';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manganeloteam.com';
    }
}
*/