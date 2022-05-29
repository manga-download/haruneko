// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DRKMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/drkmangas\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drkmangas', 'DRK Mangas', 'https://drkmangas.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DRKMangas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'drkmangas';
        super.label = 'DRK Mangas';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://drkmangas.site';
    }
}
*/