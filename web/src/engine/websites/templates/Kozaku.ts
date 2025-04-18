/* Kōsaku WC

Version: 1.8.4.0

Author: King

Description:Redesigned especially for catharsisworld

* Look likes madara but no similar endpoint
* Spanish websites (?)
* Use modified madare endpoint to get mangas
            action: 'madara_load_more',
            page: page.toString(),
            template: 'madara-core/content/content-search',
*/

import { FetchCSS } from "../../platform/FetchProvider";
import { DecoratableMangaScraper, Manga, type MangaPlugin } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
import * as Madara from '../decorators/WordPressMadara';

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
export class Kozaku extends DecoratableMangaScraper {

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
        const data = await FetchCSS<HTMLAnchorElement>(request, 'button a.grid.w-full');
        return data.map(anchor => new Manga(this, provider, anchor.pathname, anchor.title.trim()));
    }

}