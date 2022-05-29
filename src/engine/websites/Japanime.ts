// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Japanime.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/japanime\.ch\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('japanime', 'Japanime', 'https://japanime.ch'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Japanime extends WordPressMadara {

    constructor() {
        super();
        super.id = 'japanime';
        super.label = 'Japanime';
        this.tags = [ 'manga', 'webtoon', 'french' ];
        this.url = 'https://japanime.ch';
    }
}
*/