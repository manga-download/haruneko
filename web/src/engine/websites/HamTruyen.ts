import { Tags } from '../Tags';
import icon from './HamTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ImageExtractor(img: HTMLImageElement) {
    return img.dataset.original;
}

@Common.MangaCSS(/https:\/\/hamtruyen\.info\//, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('/danhsach/P{page}/index.html', 'h4.story-name a')
@Common.ChaptersSinglePageCSS('div.chap-item-info h5.name a')
@Common.PagesSinglePageCSS('div.list-images img', ImageExtractor)
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hamtruyen', `HamTruyen`, 'https://hamtruyen.info', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}