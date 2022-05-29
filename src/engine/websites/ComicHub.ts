// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ComicHub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comichub\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comichub', 'ComicHub', 'https://comichub.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicHub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comichub';
        super.label = 'ComicHub';
        this.tags = [ 'comic', 'english' ];
        this.url = 'https://comichub.net';
    }
}
*/