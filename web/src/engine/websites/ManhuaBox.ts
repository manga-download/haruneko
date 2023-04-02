// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ManhuaBox.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhuabox\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuabox', 'ManhuaBox', 'https://manhuabox.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhuaBox extends WordPressMadara {

    constructor() {
        super();
        super.id = 'manhuabox';
        super.label = 'ManhuaBox';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://manhuabox.net';

        this.queryPages = 'div.reading-content p source';
    }
}
*/