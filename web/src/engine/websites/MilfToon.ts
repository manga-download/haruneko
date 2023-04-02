// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MilfToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/milftoon\.xxx\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('milftoon', 'Milftoon Comics', 'https://milftoon.xxx'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MilfToon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'milftoon';
        super.label = 'Milftoon Comics';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://milftoon.xxx';
    }
}
*/