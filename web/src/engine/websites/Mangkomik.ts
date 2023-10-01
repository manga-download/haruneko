// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Mangkomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangkomik\.net\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangkomik', 'Mangkomik', 'https://mangkomik.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Mangkomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangkomik';
        super.label = 'Mangkomik';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://mangkomik.com';
        this.path = '/manga/list-mode/';
    }
}
*/