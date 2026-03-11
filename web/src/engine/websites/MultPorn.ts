import { Tags } from '../Tags';
import icon from './MultPorn.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';

const pageScript = `
    new Promise( resolve => {
        resolve(Array(jcgal.getImageCount()).fill().map((_, index) => jcgal.getImageInfo(index + 1).largeImageURL));
    });
`;

const categories = ['comics', 'pictures', 'hentai', 'hentai_manga', 'manga', 'rule_63', 'humor', 'gay_porn_comics', 'games'];

@Common.ChaptersMultiPageCSS('div.view-content table tr td strong.field-content a', Common.PatternLinkGenerator('{id}?page=0,{page}', 0))
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('multporn', 'MultPorn', 'https://multporn.com', Tags.Media.Comic, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(${categories.join('|')})/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {

        //user may paste a "chapter" instead of a "manga" (subcategory) link.
        const dom = await FetchHTML(new Request(url));
        const oddNode = dom.querySelector<HTMLAnchorElement>('div.breadcrumb span.odd:not(.first) a[rel="v:url"]');
        const lastNode = dom.querySelector('div.breadcrumb span.last');
        const title = oddNode ? oddNode.textContent.trim() : lastNode.textContent.trim();
        const id = oddNode ? oddNode.pathname : new URL(url).pathname;
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const cancellator = new AbortController();
        try {
            const promises: Promise<Manga[]>[] = [];
            for (const category of categories) {
                const promise = Common.FetchMangasMultiPageCSS.call(this, provider, 'div.view-content table tr td strong a', Common.PatternLinkGenerator(category + '?page={page}'), 750);
                promises.push(promise);
            }
            const results = (await Promise.all(promises)).flat();
            return results.distinct();
        } catch (error) {
            cancellator.abort();
            throw error;
        }
    }
}