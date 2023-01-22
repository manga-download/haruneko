// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MixedManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mixedmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mixedmanga', 'MixedManga', 'https://mixedmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MixedManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mixedmanga';
        super.label = 'MixedManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mixedmanga.com';
    }
}
*/