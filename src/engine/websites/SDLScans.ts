// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SDLScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sdlscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sdlscans', 'SDL Scans', 'https://sdlscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SDLScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sdlscans';
        super.label = 'SDL Scans';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://sdlscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/