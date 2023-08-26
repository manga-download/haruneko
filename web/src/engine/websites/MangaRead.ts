import { Tags } from '../Tags';
import icon from './MangaRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.mangaread\.org\/manga\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaread', 'MangaRead', 'https://www.mangaread.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRead extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangaread';
        super.label = 'MangaRead';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://www.mangaread.org';
    }
}
*/