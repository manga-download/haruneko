import { Tags } from '../Tags';
import icon from './HentaiRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/hentai\/[^/]+\/$/, 'div.manga-titles h1')
@Common.MangasMultiPageCSS('div.manga-grid a.manga-item__link', Common.PatternLinkGenerator('/hentai/page/{page}/'), 150)
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section#mangaSummary a.block', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLImageElement>('img').alt.trim()
}))
@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        for (const value of Object.values(window).filter(value => typeof value === 'string')) {
            try {
                const { data : {chapter : { images }} } = JSON.parse(atob(value));
                resolve(images.map(({ src }) => chapterExtraData.baseUrl+ '/'+ src));
            } catch {}
        }
    });
`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', 'HentaiRead', 'https://hentairead.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}