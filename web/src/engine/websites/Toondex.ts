import { Tags } from '../Tags';
import icon from './Toondex.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+\/$/, 'div.container div[class=""] h1.font-semibold')
@Common.MangasMultiPageCSS('div.grid a:has(h2.box-title)', Common.PatternLinkGenerator('/latest-updates/{page}/'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapters-box ul li a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLDivElement>('div.font-medium').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.container img[id*="row"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toondex', 'Toondex', 'https://toondex.co', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}