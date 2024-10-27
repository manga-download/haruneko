import { Tags } from '../Tags';
import icon from './WeebCentral.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaLabelExtractor(meta: HTMLMetaElement): string {
    return meta.content.split('|').shift().trim();
}

const pageScript = `[...document.querySelectorAll('main section img[alt*="Page"]:not([x-show]')].map(image => new URL(image.getAttribute('src'), window.location.origin).href);`;

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/[^/]+$/, 'meta[property="og:title"]', MangaLabelExtractor)
@Common.MangasMultiPageCSS(`/search/data?limit=32&offset={page}&display_mode=Full+Display`, 'a.link.link-hover[href*="/series/"]', 0, 32, 0)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('weebcentral', 'WeebCentral', 'https://weebcentral.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const serieId = manga.Identifier.match(/(\/series\/[^/]+)\//)[1];
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${serieId}/full-chapter-list`, this.URI)), 'a[href*="/chapters/"]');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.querySelector<HTMLSpanElement>('span.grow span').textContent.trim()));
    }

}