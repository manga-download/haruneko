// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './WordHero.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/wordhero\.my\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wordhero', 'WordHero', 'https://www.wordhero.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WordHero extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'wordhero';
        super.label = 'WordHero';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://wordhero.my.id';
        this.path = '/manga/list-mode/';
    }

}
*/