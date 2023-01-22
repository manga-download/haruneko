// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Opiatoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.opiatoon\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('opiatoon', 'Opiatoon (Opia&Shipperland)', 'https://www.opiatoon.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Opiatoon extends WordPressMadara {

    constructor() {
        super();
        super.id = 'opiatoon';
        super.label = 'Opiatoon (Opia&Shipperland)';
        this.tags = [ 'manga', 'turkish', 'webtoon' ];
        this.url = 'https://www.opiatoon.net';
    }
}
*/