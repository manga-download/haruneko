// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaRocky.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangarocky\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarocky', 'Manga Rocky', 'https://mangarocky.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRocky extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangarocky';
        super.label = 'Manga Rocky';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangarocky.com';
    }
}
*/