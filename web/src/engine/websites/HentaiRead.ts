import { Tags } from '../Tags';
import icon from './HentaiRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise( resolve => resolve(window.chapterData.images.map(image => image.src)));
`;

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/hentai\/[^/]+\/$/, 'div.manga-titles h1')
@Common.MangasMultiPageCSS('/hentai/page/{page}/', 'div.manga-grid div.manga-item div.manga-item__bottom a', 1, 1, 150)
@Common.ChaptersSinglePageCSS('section#mangaSummary a.block', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', 'HentaiRead', 'https://hentairead.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}