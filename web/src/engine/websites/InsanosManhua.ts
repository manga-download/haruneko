import { Tags } from '../Tags';
import icon from './InsanosManhua.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type ChapterData = {
    manga_id: string;
    nonce: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumbs__list li:last-of-type')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/manga/', 'a.catalog-card__link', anchor => ({ id: anchor.pathname, title: anchor.querySelector('.catalog-card__title').textContent.trim() }))
@Common.PagesSinglePageCSS('div.reader-container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('insanosmanhua', 'Insanos Manhua', 'https://insanoslibrary.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga_id, nonce } = await FetchWindowScript<ChapterData>(new Request(new URL(manga.Identifier, this.URI)),
            `new Promise(resolve =>  resolve( { nonce: AdarConfig.nonce, manga_id: insanosData.manga_id }));`, 500);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { html } } = await FetchJSON<{ data: { html: string } }>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'adar_load_chapters',
                        nonce,
                        series_id: manga_id,
                        page: `${page}`,
                        order: 'desc',
                    })
                }));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('a.chapter-row')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.querySelector('.chapter-row__num').textContent.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }
}