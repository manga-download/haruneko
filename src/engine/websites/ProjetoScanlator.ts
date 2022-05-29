// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ProjetoScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/projetoscanlator\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('projetoscanlator', 'Projeto Scanlator', 'https://projetoscanlator.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ProjetoScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'projetoscanlator';
        super.label = 'Projeto Scanlator';
        this.tags = [ 'manga', 'portuguese' ];
        this.url = 'https://projetoscanlator.com';
    }
}
*/