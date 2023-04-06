// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MataKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/matakomik\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('matakomik', 'Matakomik', 'https://matakomik.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MataKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'matakomik';
        super.label = 'Matakomik';
        this.tags = [ 'webtoon', 'manga', 'indonesian' ];
        this.url = 'https://matakomik.com';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/