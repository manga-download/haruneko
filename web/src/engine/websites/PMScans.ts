// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PMScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/rackusreader\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pmscans', 'Rackus', 'https://rackusreader.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PMScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pmscans';
        super.label = 'Rackus';
        this.tags = [ 'manga', 'webtoon', 'scanlation', 'english' ];
        this.url = 'https://rackusreader.org';
        this.path = '/manga/list-mode/';
    }
}
*/