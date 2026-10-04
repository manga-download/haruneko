import { Tags } from '../Tags';
import icon from './MangaOni.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise((resolve) => {
        resolve(hojas.map(img => dir + img));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'article.manga h1.post-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#content div#content-left div#article-div a', Common.PatternLinkGenerator('/directorio?p={page}'), 0, anchor => ({
    id: anchor.pathname, title: anchor.querySelector<HTMLSpanElement>('span').textContent.trim()
}))
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