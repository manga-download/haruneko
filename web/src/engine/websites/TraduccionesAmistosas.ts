// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TraduccionesAmistosas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/nartag\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('traduccionesamistosas', 'Traducciones Amistosas', 'https://nartag.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TraduccionesAmistosas extends WordPressMadara {

    constructor() {
        super();
        super.id = 'traduccionesamistosas';
        super.label = 'Traducciones Amistosas';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://nartag.com';
    }
}
*/