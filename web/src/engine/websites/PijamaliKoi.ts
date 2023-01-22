// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './PijamaliKoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/pijamalikoi\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/m/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pijamalikoi', 'Pijamalı Koi', 'https://pijamalikoi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PijamaliKoi extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pijamalikoi';
        super.label = 'Pijamalı Koi';
        this.tags = [ 'manga', 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://pijamalikoi.com';
        this.path = '/m/manga/list-mode/';
    }
}
*/