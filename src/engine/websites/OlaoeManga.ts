// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OlaoeManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/olaoe\.giize\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olaoemanga', 'مانجا اونلاين (Olaoe Manga)', 'https://olaoe.giize.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OlaoeManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'olaoemanga';
        super.label = 'مانجا اونلاين (Olaoe Manga)';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://olaoe.giize.com';
    }
}
*/