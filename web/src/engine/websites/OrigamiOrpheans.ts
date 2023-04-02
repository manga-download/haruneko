// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './OrigamiOrpheans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/origami-orpheans\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('origamiorpheans', 'ORIGAMI ORPHEANS', 'https://origami-orpheans.com.br'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class OrigamiOrpheans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'origamiorpheans';
        super.label = 'ORIGAMI ORPHEANS';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://origami-orpheans.com.br';
    }
}
*/