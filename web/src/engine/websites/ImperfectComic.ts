// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './ImperfectComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/imperfectcomic\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/list/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperfectcomic', 'Imperfect Comic', 'https://imperfectcomic.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperfectComic extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'imperfectcomic';
        super.label = 'Imperfect Comic';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://imperfectcomic.com';
    }
}
*/