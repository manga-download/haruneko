// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './KomikNesia.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/komiknesia\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.listttl ul li a', '/latest-update/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list span.eps a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiknesia', 'KomikNesia', 'https://komiknesia.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class KomikNesia extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'komiknesia';
        super.label = 'KomikNesia';
        this.tags = [ 'manga', 'webtoon', 'indonesian' ];
        this.url = 'https://komiknesia.com';
        this.path = '/latest-update/?list';

        this.queryMangas = 'div.listttl ul li a';
        this.queryChapters = 'div#chapter_list span.eps a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/