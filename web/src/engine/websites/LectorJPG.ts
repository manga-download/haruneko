import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('div.grid span.truncate').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/serie\/[^/]+\/$/, 'meta[property="og:title"]', (element) => (element as HTMLMetaElement).content.split('-').at(0).trim())
@Common.ChaptersSinglePageCSS('ul#list-chapters li a', ChapterExtractor)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lectorjpg', 'LectorJPG', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    public async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const form = new URLSearchParams({
            action: 'madara_load_more',
            page: page.toString(),
            template: 'madara-core/content/content-search',
            "vars[paged]": '1',
            "vars[template]": 'search',
            "vars[post_type]": 'wp-manga',
        });

        const request = new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            body: form.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Referer: this.URI.href
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'button div.grid > a');
        return data.map(anchor => new Manga(this, provider, anchor.pathname, anchor.title.trim()));
    }
}