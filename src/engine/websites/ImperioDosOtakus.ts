// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ImperioDosOtakus.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/imperiodosotakus\.tk\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperiodosotakus', 'Imperio dos Otakus', 'https://imperiodosotakus.tk'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperioDosOtakus extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperiodosotakus';
        super.label = 'Imperio dos Otakus';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://imperiodosotakus.tk';
    }
}
*/