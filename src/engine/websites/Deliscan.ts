// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './Deliscan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/deliscan\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('deliscan', 'Deliscan', 'https://deliscan.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Deliscan extends WordPressMadara {

    constructor() {
        super();
        super.id = 'deliscan';
        super.label = 'Deliscan';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://deliscan.xyz';
    }
}
*/