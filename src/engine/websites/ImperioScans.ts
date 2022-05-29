// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ImperioScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/imperioscans\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperioscans', 'Império Scans', 'https://imperioscans.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperioScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperioscans';
        super.label = 'Império Scans';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://imperioscans.com.br';
    }
}
*/