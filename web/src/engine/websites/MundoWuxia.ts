// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MundoWuxia.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mundowuxia\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mundowuxia', 'Mundo Wuxia', 'https://mundowuxia.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MundoWuxia extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mundowuxia';
        super.label = 'Mundo Wuxia';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://mundowuxia.com';
    }
}
*/