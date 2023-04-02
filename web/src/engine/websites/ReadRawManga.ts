// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ReadRawManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.readrawmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readrawmanga', 'ReadRawManga', 'https://www.readrawmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadRawManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'readrawmanga';
        super.label = 'ReadRawManga';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://www.readrawmanga.com';
    }
}
*/