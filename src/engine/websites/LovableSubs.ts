// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './LovableSubs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/lovablesubs\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lovablesubs', 'lovablesubs', 'https://lovablesubs.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LovableSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lovablesubs';
        super.label = 'lovablesubs';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'https://lovablesubs.com';
    }

    getFormatRegex() {
        return {
            chapterRegex: /\s*(?:^|ch\.?|ep\.?|chapter|Bölüm|chapitre|episode|#)?\s*([\d.?\-?v?,?]+)\s*(?:^|ch\.?|ep\.?|chapter|\.?Bölüm|chapitre|episode|#)?\s*(?:\s|:|$)+/i, // $ not working in character groups => [\s\:$]+ does not work
            volumeRegex: super.getFormatRegex().volumeRegex
        };
    }
}
*/