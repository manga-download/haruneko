import { Tags } from '../Tags';
import icon from './MangaSushi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasushi', 'Mangasushi', 'https://mangasushi.org', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSushi extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasushi';
        super.label = 'Mangasushi';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://mangasushi.net';
    }
}
*/