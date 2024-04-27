import { Tags } from '../Tags';
import icon from './HDPornComics.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLMetaElement): string {
    return element.content.split('|')[0].trim().replace(/comic porn$/i, '').trim();
}
function PageExtractor(element: HTMLAnchorElement): string {
    return element.href;
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'meta[property="og:title"]', MangaLabelExtractor)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('article.postContent div.scrollmenu figure a', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hdporncomics', 'HDPornComics', 'https://hdporncomics.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const nonce = await FetchWindowScript<string>(new Request(this.URI), 'misha_loadmore_params.nonce', 500);
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider, nonce);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, nonce: string) {
        const uri = new URL('/wp-admin/admin-ajax.php', this.URI);
        const body = new URLSearchParams({
            action: 'loadmore',
            query: JSON.stringify({
                posts_per_page: '250',
            }),
            page: page.toString(),
            security: nonce
        }).toString();

        const request = new Request(uri, {
            method: 'POST', body: body, headers: {
                'Content-Type': 'application/x-www-form-urlencoded;',
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a[class]');
        return data.map(item => new Manga(this, provider, item.pathname, item.querySelector('h2').textContent.trim().replace(/comic porn$/i, '').trim()));
    }

}