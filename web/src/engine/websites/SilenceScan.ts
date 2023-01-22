// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SilenceScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/silencescan\.com\.br\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('silencescan', 'Silence Scan', 'https://silencescan.com.br', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SilenceScan extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'silencescan';
        super.label = 'Silence Scan';
        this.tags = [ 'manga', 'webtoon', 'portuguese', 'scanlation' ];
        this.url = 'https://silencescan.com.br';
        this.path = '/manga/list-mode/';
    }
}
*/