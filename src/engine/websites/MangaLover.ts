// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaLover.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/3asq\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalover', '3asq (مانجا العاشق)', 'https://3asq.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLover extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangalover';
        super.label = '3asq (مانجا العاشق)';
        this.tags = [ 'manga', 'arabic' ];
        this.url = 'https://3asq.org';
    }
}
*/