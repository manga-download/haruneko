// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GabutScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/gabutscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gabutscans', 'Gabut Scans', 'https://gabutscans.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GabutScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gabutscans';
        super.label = 'Gabut Scans';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://gabutscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/