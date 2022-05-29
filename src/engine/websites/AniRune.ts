// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './AniRune.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/anirune\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anirune', 'AniRune', 'https://anirune.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class AniRune extends WordPressMadara {

    constructor() {
        super();
        super.id = 'anirune';
        super.label = 'AniRune';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://anirune.com';
    }
}
*/