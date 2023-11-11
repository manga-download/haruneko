// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://mangacrab.com'/*, Tags.Media., Tags.Language.*/, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaCrab extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangacrab';
        super.label = 'Manga Crab';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://mangacrab.com';
    }
}
*/