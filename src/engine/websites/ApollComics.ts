// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ApollComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/apollcomics\.xyz\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apollcomics', 'Apoll Comics', 'https://apollcomics.xyz'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ApollComics extends WordPressMadara {

    constructor() {
        super();
        super.id = 'apollcomics';
        super.label = 'Apoll Comics';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://apollcomics.xyz';
    }
}
*/