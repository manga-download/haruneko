import { Tags } from '../Tags';
import icon from './MultPorn.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise( resolve => {
        resolve(Array(jcgal.getImageCount()).fill().map((_, index) => jcgal.getImageInfo(index + 1).largeImageURL));
    });
`;

const categories = ['comics', 'pictures', 'hentai', 'hentai_manga', 'rule_63', 'humor', 'gay_porn_comics', 'games'];

type DrupalSettings = {
    views?: {
        ajaxViews?: {
            [id: string]: {
                pager_element: number,
                view_args: string,
                view_base_path: string,
                view_display_id: string,
                view_dom_id: string,
                view_name: string,
                view_path: string
            }
        }
    }
}

type DrupalResult = {
    command: string,
    data :string
}

@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/views/ajax`;

    public constructor() {
        super('multporn', 'MultPorn', 'https://multporn.net', Tags.Media.Comic, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/(${categories.join('|')})/[^/]+`).test(url);
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
                const promise = Common.FetchMangasMultiPageCSS.call(this, provider, category + '?page={page}', 'div.view-content table tr td strong a', 0);
                promises.push(promise);
            }
            const results = (await Promise.all(promises)).flat();
            return results.distinct();
        } catch (error) {
            cancellator.abort();
            throw error;
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        const settings = await FetchWindowScript<DrupalSettings>(new Request(url), 'Drupal.settings');

        if (settings.views?.ajaxViews) {
            const chapterList = [];
            for (let page = 0, run = true; run; page++) {
                const chapters = await this.GetChaptersFromAjaxPage(manga, page, settings);
                chapters.length > 0 ? chapterList.push(...chapters) : run = false;
            }
            return chapterList;
        } else {
            return Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.view-content table tr td strong.field-content a');
        }

    }

    private async GetChaptersFromAjaxPage(manga: Manga, page: number, settings: DrupalSettings): Promise<Chapter[]> {

        const view = Object.values(settings.views.ajaxViews).shift();
        const params = new URLSearchParams();
        for (const key of Object.keys(view)) {
            params.append(key, view[key]);
        };
        params.set('page', `0,${page}`);

        const results = await FetchJSON<DrupalResult[]>(new Request(this.apiUrl, {
            method: 'POST',
            body: params.toString(),
            headers: {
                Accept: 'application/json, text/javascript, */*; q=0.01',
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                Origin: this.URI.origin,
                Referer: new URL(manga.Identifier, this.URI).href
            }
        }));

        const { data } = results.find(entry => entry.command == 'insert');
        const dom = new DOMParser().parseFromString(data, 'text/html');
        const nodes = dom.querySelectorAll<HTMLAnchorElement>('div.view-content table tr td strong.field-content a');
        return [...nodes].map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }
}