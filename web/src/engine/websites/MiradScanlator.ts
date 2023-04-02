// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MiradScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/miradscanlator\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('miradscanlator', 'Mirad Scanlator', 'https://miradscanlator.site'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MiradScanlator extends WordPressMadara {

    constructor() {
        super();
        super.id = 'miradscanlator';
        super.label = 'Mirad Scanlator';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation', 'hentai' ];
        this.url = 'https://miradscanlator.site';
    }
}
*/