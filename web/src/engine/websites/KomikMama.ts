// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikMama.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komikmama\.net\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div.bxcl ul li div.lch a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikmama', 'Komikmama', 'https://komikmama.net', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikMama extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komikmama';
        super.label = 'Komikmama';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://komikmama.net';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div.bxcl ul li div.lch a';
        this.queryChaptersTitle = undefined;
    }
}
*/