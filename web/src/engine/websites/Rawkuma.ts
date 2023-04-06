// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Rawkuma.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/rawkuma\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawkuma', 'Rawkuma', 'https://rawkuma.com', Tags.Media.Manga, Tags.Language.Japanese);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Rawkuma extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'rawkuma';
        super.label = 'Rawkuma';
        this.tags = [ 'manga', 'raw', 'japanese' ];
        this.url = 'https://rawkuma.com';
        this.path = '/manga/list-mode/';
    }
}
*/