import { Tags } from '../Tags';
import icon from './HamTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ImageExtractor(img: HTMLImageElement) {
    return img.dataset.original;
}

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('/danhsach/P{page}/index.html', 'ul.lst_story li.story_item a.story_title')
@Common.ChaptersSinglePageCSS('ul.lst-chapter li.chap-item a')
@Common.PagesSinglePageCSS('div#lst_content div.page-chapter img', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hamtruyen', `HamTruyen`, 'https://hamtruyen.info', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}