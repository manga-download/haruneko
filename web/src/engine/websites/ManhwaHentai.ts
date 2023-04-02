// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhwaHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuas\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuas', 'Manhuas', 'https://manhuas.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwaHentai extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuas';
        super.label = 'Manhuas';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuas.net';
    }
}
*/