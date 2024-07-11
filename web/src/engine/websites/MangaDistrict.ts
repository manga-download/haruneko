import { Tags } from '../Tags';
import icon from './MangaDistrict.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function PageExtractor(image: HTMLImageElement): string {
    return image.dataset.wpfcOriginalSrc || image.src;
}

@Madara.MangaCSS(/^{origin}\/read-scan\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="MANGA DISTRICT"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageCSS('div.page-break img', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadistrict', 'MangaDistrict', 'https://mangadistrict.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}