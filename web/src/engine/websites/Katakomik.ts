// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './Katakomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.katakomik\.my\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.bsx a', '/list/')
@MangaStream.ChaptersSinglePageCSS('div.eph-num a')
@MangaStream.PagesSinglePageCSS([], 'img.ts-main-image.curdown')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('katakomik', 'Katakomik', 'https://www.katakomik.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Katakomik extends WordPressMangastream {
    constructor() {
        super();
        super.id = 'katakomik';
        super.label = 'Katakomik';
        this.tags = ['webtoon', 'indonesian'];
        this.url = 'https://www.katakomik.my.id';

        this.queryMangas = 'div.bsx a';
        this.queryChapters = 'div.eph-num a';
        this.queryChaptersTitle = 'span.chapternum';
        this.queryPages = 'img.ts-main-image.curdown';
    }
}
*/