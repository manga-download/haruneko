// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './InfernalVoidScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/infernalvoidscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('infernalvoidscans', 'InfernalVoidScans', 'https://infernalvoidscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class InfernalVoidScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'infernalvoidscans';
        super.label = 'InfernalVoidScans';
        this.tags = [ 'webtoon', 'scanlation', 'english' ];
        this.url = 'https://infernalvoidscans.com';
        this.path = '/manga/list-mode/';
    }
}
*/