import { Tags } from '../Tags';
import icon from './InsanosManhua.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type ChapterData = {
    series_id: string;
    nonce: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumbs__list li:last-of-type')
@Common.MangasSinglePageCSS('/manga/', 'a.catalog-card__link span.catalog-card__title', span => ({ id: span.closest('a').pathname, title: span.innerText.trim() }))
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
        const { series_id, nonce } = await FetchWindowScript<ChapterData>(new Request(new URL(manga.Identifier, this.URI)), `({ series_id: insanosData.manga_id, nonce: AdarConfig.nonce });`, 500);
        const body = new URLSearchParams({ action: 'adar_load_chapters', nonce, series_id, order: 'desc' });
        const uri = new URL('/wp-admin/admin-ajax.php', this.URI);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                body.set('page', `${page}`);
                const { data: { html } } = await FetchJSON<{ data: { html: string } }>(new Request(uri, {
                    body, method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }));
                const dom = new DOMParser().parseFromString(html, 'text/html');
                const chapters = [...dom.querySelectorAll<HTMLElement>('a.chapter-row span.chapter-row__num')]
                    .map(element => new Chapter(this, manga, element.closest('a').pathname, element.innerText.trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }
}