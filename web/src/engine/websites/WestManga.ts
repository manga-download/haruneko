// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './WestManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/westmanga\.info\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('westmanga', 'WestManga', 'https://westmanga.info', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WestManga extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'westmanga';
        super.label = 'WestManga';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://westmanga.info';
        this.path = '/manga/list-mode/';
    }
}
*/