// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Nekomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/nekomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nekomik', 'Nekomik', 'https://nekomik.com/', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Nekomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'nekomik';
        super.label = 'Nekomik';
        this.tags = ['manga', 'indonesian'];
        this.url = 'https://nekomik.com/';
        this.path = '/manga/list-mode/';
    }
}
*/