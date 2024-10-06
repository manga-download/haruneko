import { Tags } from '../Tags';
import icon from './Tenkai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('div.content h4').textContent.trim()
    };
}
function ChapterExtractor(element: HTMLDivElement) {
    return {
        id: new URL(element.getAttribute('onclick').match(/location\.href\s*=\s*['"]([^'"]+)/)[1]).pathname,
        title: element.querySelector<HTMLSpanElement>('div div span.color-white.d-block').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'meta[property="og:title"]', (element: HTMLMetaElement) => element.content.split('|').at(0).trim())
@Common.MangasSinglePageCSS('/comics', 'div.col-xxl-9 div.row a[href*="/comics/"]', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.specmobile div[onclick]', ChapterExtractor)
@Common.PagesSinglePageCSS('div.page-content div.container div.img-blade img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tenkai', 'Tenkai', 'https://tenkaiscan.net', Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}