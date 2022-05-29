// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AnshScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/anshscans\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anshscans', 'AnshScans', 'https://anshscans.org'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AnshScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anshscans';
        super.label = 'AnshScans';
        this.tags = [ 'webtoon', 'english', 'scanlation' ];
        this.url = 'https://anshscans.org';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/