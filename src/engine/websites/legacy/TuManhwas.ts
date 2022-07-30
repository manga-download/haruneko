// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TuManhwas.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
//import * as Madara from './decorators/WordPressMadara';
import * as Common from '../decorators/Common';

// TODO: Moved to https://tumanhwas.com (WordPRessMangaStream)
//@Madara.MangaCSS(/^https?:\/\/tumanhwas\.com\/manga\/[^/]+\/$/)
//@Madara.MangasMultiPageAJAX()
//@Madara.ChaptersSinglePageAJAXv1()
//@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumanhwas', 'TuManhwas', 'https://tumanhwas.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LeerManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'leermanhua';
        super.label = 'Leermanhua';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://leermanhua.com';
    }
}
*/