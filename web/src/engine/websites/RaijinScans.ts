import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function PageExtractor(img: HTMLImageElement) {
    return img.dataset.src.trim().replace(/^http:/, 'https:');
}

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Raijin Scans"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageCSS('div.page-break div.image-wrapper img[id]', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raijinscans', 'RaijinScans', 'https://raijinscans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}