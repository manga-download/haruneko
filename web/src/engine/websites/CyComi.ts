import { Tags } from '../Tags';
import icon from './CyComi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.card-texts-title').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.chapter-title').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/cycomi\.com\/[^/]+\//, 'div.title-texts > h3')
@Common.MangasMultiPageCSS('/fw/cycomibrowser/title/serialization/{page}', 'div.card-content > a.card', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('.title-chapters > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div.swiper-slide > img.viewer-image.comic-image')//this selector omit first and last page which are blank
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cycomi', `CyComi`, 'https://cycomi.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}