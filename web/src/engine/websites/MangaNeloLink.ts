// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaNeloLink.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manganelo\.link\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelolink', 'Manga Nelo Link', 'https://manganelo.link'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaNeloLink extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manganelolink';
        super.label = 'Manga Nelo Link';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://manganelo.link';
    }
}
*/