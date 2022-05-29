// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './CatTranslator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cat-translator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cat-translator', 'Cat-Translator', 'https://cat-translator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class CatTranslator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'cat-translator';
        super.label = 'Cat-Translator';
        this.tags = [ 'manga', 'webtoon', 'thai' ];
        this.url = 'https://cat-translator.com';
        this.path = '/manga';
    }
}
*/