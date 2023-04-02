// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './RedRibbon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/redribbon\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('redribbon', 'Red Ribbon', 'https://redribbon.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RedRibbon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'redribbon';
        super.label = 'Red Ribbon';
        this.tags = [ 'manga', 'portuguese', 'scanlation' ];
        this.url = 'https://redribbon.site';
    }
}
*/