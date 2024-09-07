import { Tags } from '../Tags';
import icon from './MagusManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pagesScript = `
    new Promise ( resolve => {
         resolve( [...document.querySelectorAll('.myImage')].map(image => 'https://cdn.igniscans.com/uploads/'+ image.getAttribute('uid')));
    });
`;

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasSinglePageCSS('/series', 'div#searched_series_page button a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapters a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('magusmanga', 'MagusManga', 'https://magustoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}