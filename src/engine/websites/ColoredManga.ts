// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ColoredManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/coloredmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('coloredmanga', 'Colored Manga', 'https://coloredmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ColoredManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'coloredmanga';
        super.label = 'Colored Manga';
        this.tags = ['manga', 'english'];
        this.url = 'https://coloredmanga.com';
    }
}
*/