// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ToonilyNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/toonily\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonilynet', 'Toonily.net', 'https://toonily.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ToonilyNet extends WordPressMadara {

    constructor() {
        super();
        super.id = 'toonilynet';
        super.label = 'Toonily.net';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://toonily.net';
    }
}
*/