// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PairOfTwo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/pairof2\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pairoftwo', 'Pair of 2', 'https://pairof2.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PairOfTwo extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pairoftwo';
        super.label = 'Pair of 2';
        this.tags = [ 'manga', 'english' ];
        this.url = 'https://pairof2.com';
        this.path = '/manga/list-mode/';
    }
}
*/