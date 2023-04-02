// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './PocketAngelScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/pocketangelscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pocketangelscans', 'Pocket Angel Scans', 'https://pocketangelscans.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PocketAngelScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'pocketangelscans';
        super.label = 'Pocket Angel Scans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://pocketangelscans.com';
    }
}
*/