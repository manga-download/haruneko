// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NiveraFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/niverafansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niverafansub', 'Nivera Fansub', 'https://niverafansub.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NiveraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'niverafansub';
        super.label = 'Nivera Fansub';
        this.tags = [ 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://niverafansub.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/