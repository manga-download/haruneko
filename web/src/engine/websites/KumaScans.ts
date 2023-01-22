// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KumaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/kumascans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumascans', 'Kuma Scans', 'https://kumascans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KumaScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kumascans';
        super.label = 'Kuma Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://kumascans.com';
        this.path = '/manga/list-mode/';
    }
}
*/