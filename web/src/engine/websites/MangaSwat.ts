// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaSwat.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/swatmanga\.co\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaswat', 'SWAT Manga', 'https://swatmanga.co', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaSwat extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangaswat';
        super.label = 'SWAT Manga';
        this.tags = ['webtoon', 'arabic'];
        this.url = 'https://swatmanga.co';
        this.path = '/manga/?list';

        this.queryChapters = 'div.bxcl ul li span.lchx a';
        this.queryChaptersTitle = undefined;
    }
}
*/