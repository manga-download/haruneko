// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './WhiteCloudPavilion.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.whitecloudpavilion\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/read/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('whitecloudpavilion', 'White Cloud Pavilion', 'https://www.whitecloudpavilion.com', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WhiteCloudPavilion extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'whitecloudpavilion';
        super.label = 'White Cloud Pavilion';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'https://www.whitecloudpavilion.com';
        this.path = '/read/list-mode/';
    }
}
*/