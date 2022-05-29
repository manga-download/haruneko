// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './GoddessManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/goddessmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goddessmanga', 'GoddessManga', 'https://goddessmanga.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoddessManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'goddessmanga';
        super.label = 'GoddessManga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://goddessmanga.com';
    }

    getFormatRegex() {
        return {
            chapterRegex: /\s*(?:^|ch\.?|ep\.?|chapter|Bölüm|chapitre|episode|#)?\s*([\d.?\-?v?,?]+)\s*(?:^|ch\.?|ep\.?|chapter|\.?Bölüm|chapitre|episode|#)?\s*(?:\s|:|$)+/i, // $ not working in character groups => [\s\:$]+ does not work
            volumeRegex: super.getFormatRegex().volumeRegex
        };
    }
}
*/