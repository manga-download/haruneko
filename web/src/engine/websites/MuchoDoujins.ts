// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MuchoDoujins.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/muchodoujins\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('muchodoujins', 'MuchoDoujins', 'https://muchodoujins.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MuchoDoujins extends WordPressMadara {

    constructor() {
        super();
        super.id = 'muchodoujins';
        super.label = 'MuchoDoujins';
        this.tags = [ 'hentai', 'english' ];
        this.url = 'https://muchodoujins.com';
    }
}
*/