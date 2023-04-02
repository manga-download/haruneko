// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Kraw.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/kraw\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kraw', 'KRAW', 'https://kraw.org', Tags.Language.Multilingual, Tags.Rating.Erotica, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Kraw extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'kraw';
        super.label = 'KRAW';
        this.tags = [ 'hentai', 'porn', 'multi-lingual' ];
        this.url = 'https://kraw.org';
        this.path = '/manga/list-mode/';
    }
}
*/