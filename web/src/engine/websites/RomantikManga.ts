// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RomantikManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/romantikmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('romantikmanga', 'RomantikManga', 'https://romantikmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RomantikManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'romantikmanga';
        super.label = 'RomantikManga';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://romantikmanga.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/