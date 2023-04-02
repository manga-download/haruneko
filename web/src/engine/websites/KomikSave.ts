// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikSave.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komiksave\.me\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/komik/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiksave', 'Komik Save', 'https://komiksave.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikSave extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komiksave';
        super.label = 'Komik Save';
        this.tags = [ 'webtoon', 'hentai', 'indonesian' ];
        this.url = 'https://komiksave.me';
        this.path = '/komik/list-mode/';
    }
}
*/