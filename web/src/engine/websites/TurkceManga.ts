// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TurkceManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.turkcemanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('turkcemanga', 'Turkce Manga', 'https://www.turkcemanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TurkceManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'turkcemanga';
        super.label = 'Turkce Manga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.turkcemanga.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.queryMangas = 'div.post-title h3 a:not([target]), div.post-title h5 a:not([target])';
    }
}
*/