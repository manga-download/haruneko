// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaTeca.webp';
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
        super('mangateca', 'MangaTeca', 'https://www.mangateca.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaTeca extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangateca';
        super.label = 'MangaTeca';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'portuguese' ];
        this.url = 'https://www.mangateca.com';
    }
}
*/