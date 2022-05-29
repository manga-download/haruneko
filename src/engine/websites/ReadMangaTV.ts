// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ReadMangaTV.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/readmanga\.tv\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmangatv', 'readmanga.tv', 'https://readmanga.tv'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadMangaTV extends WordPressMadara {

    constructor() {
        super();
        super.id = 'readmangatv';
        super.label = 'readmanga.tv';
        this.tags = [ 'manga', 'novel', 'hentai', 'porn', 'japanese' ];
        this.url = 'https://readmanga.tv';
    }
}
*/