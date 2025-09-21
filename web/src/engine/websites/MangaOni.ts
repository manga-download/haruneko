import { Tags } from '../Tags';
import icon from './MangaOni.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span').textContent.trim()
    };
}

const pageScript = `
    new Promise((resolve) => {
        resolve(hojas.map(img => dir + img));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'article.manga h1.post-title')
@Common.MangasMultiPageCSS('/directorio?p={page}', 'div#content div#content-left div#article-div a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div#entry-manga div#c_list a', undefined, Common.AnchorInfoExtractor(false, 'span, b'))
@Common.PagesSinglePageJS(pageScript, 2500) // NOTE : chapter is behind cloudflare turnstile
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaoni', 'MangaOni', 'https://manga-oni.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}