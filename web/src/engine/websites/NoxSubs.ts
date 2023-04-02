// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './NoxSubs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/noxsubs\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('noxsubs', 'Nox Subs', 'https://noxsubs.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NoxSubs extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'noxsubs';
        super.label = 'Nox Subs';
        this.tags = [ 'webtoon', 'manga', 'turkish' ];
        this.url = 'https://noxsubs.com';
        this.path = '/manga/list-mode/';
    }
}
*/