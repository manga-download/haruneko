// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LeerManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/leermanhua\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leermanhua', 'Leermanhua', 'https://leermanhua.com'/*, Tags.Media., Tags.Language.*/);
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