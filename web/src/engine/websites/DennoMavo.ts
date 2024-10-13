import { Tags } from '../Tags';
import icon from './DennoMavo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector<HTMLParagraphElement>('.info p.mangatitle').textContent.trim()
    };
}

function MangaLabelExtractor(img: HTMLImageElement) {
    return img.getAttribute('alt').trim();
}

function PageExtractor(img: HTMLImageElement) {
    return img.dataset.original || img.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/title\.php\?title=\d+$/, 'div#main-box div#logo h2 img', MangaLabelExtractor, true)
@Common.MangasSinglePageCSS('/all-list.php', 'div#all-title-list ul.title > a[href*="title.php"]:has(div.info)', MangaChapterInfoExtractor)
@Common.ChaptersSinglePageCSS('div#title ul.manga a', MangaChapterInfoExtractor)
@Common.PagesSinglePageCSS('div#manga div.page img:not([class="protector"])', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dennomavo', 'Denno Mavo', 'https://mavo.takekuma.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}