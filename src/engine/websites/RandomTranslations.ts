// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RandomTranslations.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/randomtranslations\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('randomtranslations', 'Random Translations', 'https://randomtranslations.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RandomTranslations extends WordPressMadara {

    constructor() {
        super();
        super.id = 'randomtranslations';
        super.label = 'Random Translations';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://randomtranslations.com';
    }
}
*/