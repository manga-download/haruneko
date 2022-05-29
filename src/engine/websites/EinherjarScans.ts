// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './EinherjarScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/einherjarscans\.space\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('einherjarscans', 'Einherjar Scans', 'https://einherjarscans.space'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class EinherjarScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'einherjarscans';
        super.label = 'Einherjar Scans';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://einherjarscans.space';
    }
}
*/