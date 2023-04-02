// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PornComixOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.porncomixonline\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('porncomixonline', 'PornComix', 'https://www.porncomixonline.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PornComixOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'porncomixonline';
        super.label = 'PornComix';
        this.tags = [ 'porn', 'english' ];
        this.url = 'https://www.porncomixonline.net';
    }
}
*/