// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ImperfectComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/imperfectcomic\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperfectcomic', 'Imperfect Comic', 'https://imperfectcomic.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperfectComic extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperfectcomic';
        super.label = 'Imperfect Comic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://imperfectcomic.com';
    }
}
*/