// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ReadManhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/readmanhua\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmanhua', 'ReadManhua', 'https://readmanhua.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadManhua extends WordPressMadara {

    constructor() {
        super();
        super.id = 'readmanhua';
        super.label = 'ReadManhua';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://readmanhua.net';
    }
}
*/