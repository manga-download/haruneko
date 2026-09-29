import { Exception } from '../../Error';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { type MangaPlugin, Manga, type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';

type PagesData = {
    nonce: string;
    chapter_id: number;
    page_token: string;
    load_time: number;
};

type APIPages = {
    data: {
        urls: string[];
    };
};

type APIResult = {
    data: {
        content: string;
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'main.hs-main h1.hs-title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.ch-list-item', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.dataset.title.trim()
}))
@Common.ImageAjax()
export class HolyScanBase extends DecoratableMangaScraper {

    private websitePrefix = 'holy';

    public WithPrefix(prefix: string): HolyScanBase {
        this.websitePrefix = prefix;
        return this;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const form = new URLSearchParams({
            'action': 'filter_manga_archive',
            'sort': 'latest',
            'paged': '1'
        });

        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                form.set('paged', `${page}`);

                const { data: { content } } = await FetchJSON<APIResult>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    body: form.toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': this.URI.href
                    }
                }));
                const doc = new DOMParser().parseFromString(content, 'text/html');
                const mangas = [...doc.querySelectorAll('.mc-content .mc-title a')].map((anchor: HTMLAnchorElement) => {
                    return new Manga(this, provider, anchor.pathname, anchor.title.trim());
                });
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        const { chapter_id, nonce, page_token, load_time } = await FetchWindowScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise ( (resolve, reject) => {
                try {
                    const { chapter_id, page_token, load_time }= window.${this.websitePrefix}ChapterData;
                    resolve({
                        nonce: ${this.websitePrefix}_ajax_vars.nonce,
                        chapter_id,
                        page_token,
                        load_time
                    });
                } catch {
                    resolve({});
                    return;
                }
            });
        `, 1500);

        if (!chapter_id) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

        const body = new FormData();
        body.set('action', `${this.websitePrefix}_get_chapter_images`);
        body.set('nonce', nonce);
        body.set('chapter_id', `${chapter_id}`);
        body.set('load_time', `${load_time}`);
        body.set('page_token', page_token);

        const { data: { urls } } = await FetchJSON<APIPages>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            credentials: 'same-origin',
            method: 'POST',
            body
        }));
        return urls.map(url => new Page(this, chapter, new URL(url, this.URI), { Referer: this.URI.href }));
    }
}