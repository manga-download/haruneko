import { Tags } from '../Tags';
import icon from './XXXYaoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/bl\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageCSS(undefined, (anchor: HTMLAnchorElement) => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.xyaoi-chapter-left div:not(:has(img)) div span[class]:first-of-type').textContent.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('img.wp-manga-chapter-img')].map(img=> img.src)`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xxxyaoi', 'XXXYaoi', 'https://3xyaoi.com', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}