import { Tags } from '../Tags';
import icon from './Toondex.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.font-medium').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comics\/[^/]+\/$/, 'div.container div[class=""] h1.font-semibold')
@Common.MangasMultiPageCSS('/latest-updates/{page}/', 'div.grid a:has(h2.box-title)')
@Common.ChaptersSinglePageCSS('div#chapters-box ul li a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.container img[id*="row"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toondex', 'Toondex', 'https://toondex.co', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}