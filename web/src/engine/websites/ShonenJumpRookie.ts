import { Tags } from '../Tags';
import icon from './ShonenJumpRookie.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchHTML } from '../platform/FetchProvider';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span.episode-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.series-title-container h1.series-title')
@Common.ChaptersSinglePageCSS('ul#episode-list li a.episode-content', ChapterExtractor)
@Common.PagesSinglePageCSS('div.image-container p.page-area img.js-page-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shonenjumprookie', `ジャンプルーキー (Jump Rookie)`, 'https://rookie.shonenjump.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const doc = await FetchHTML(new Request(this.URI.href));
        const mangaList: Manga[] = [...doc.querySelectorAll<HTMLAnchorElement>('section#popular-series ol.series-box-list li section.series-contents a')].map(manga => {
            return new Manga(this, provider, manga.pathname, manga.title.trim());
        });

        //get first "more" url
        let cursor = doc.querySelector<HTMLOListElement>('ol[data-series-read-more-url]').dataset.seriesReadMoreUrl;

        while (cursor) {
            const request = new Request(new URL(cursor, this.URI).href, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const response = await Fetch(request);
            const body = await response.text();
            const dom = new DOMParser().parseFromString(body, 'text/html');

            const mangas: Manga[] = await [...dom.querySelectorAll<HTMLAnchorElement>('li section.series-contents a')].map(manga => {
                return new Manga(this, provider, manga.pathname, manga.querySelector('h1.series-title').textContent.trim());
            });
            mangaList.push(...mangas);
            cursor = response.headers.get('tky-link-rel-next');
        }
        return mangaList.distinct();
    }
}