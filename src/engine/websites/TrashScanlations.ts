// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TrashScanlations.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/trashscanlations\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('trashscanlations', 'TrashScanlations', 'https://trashscanlations.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TrashScanlations extends WordPressMadara {

    constructor() {
        super();
        super.id = 'trashscanlations';
        super.label = 'TrashScanlations';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://trashscanlations.com';
    }
}
*/