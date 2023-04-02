// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ToonManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/toonmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonmanga', 'ToonManga', 'https://toonmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toonmanga';
        super.label = 'ToonManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://toonmanga.com';
    }
}
*/