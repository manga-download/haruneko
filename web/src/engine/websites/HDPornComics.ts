import { Tags } from '../Tags';
import icon from './HDPornComics.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/[^/]+\/$/, 'meta[property="og:title"]', (element, uri) => ({ id: uri.pathname, title: element.content.split('|').at(0).trim().replace(/comic porn$/i, '').trim() }))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS<HTMLAnchorElement>('article.postContent div.scrollmenu figure a', anchor => anchor.href)
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
        const body = new URLSearchParams({
            action: 'loadmore',
            query: JSON.stringify({
                posts_per_page: '250',
            }),
            security: nonce
        });

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                body.set('page', `${page}`);
                const request = new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;',
                        'Origin': this.URI.origin,
                        'Referer': this.URI.href,
                    },
                    body,
                });
                const anchors = await FetchCSS<HTMLAnchorElement>(request, 'a[class]');
                const mangas = anchors.map(item => new Manga(this, provider, item.pathname, item.querySelector('h2').textContent.trim().replace(/comic porn$/i, '').trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}