import { Tags } from '../Tags';
import icon from './RinkoComics.webp';
import { DecoratableMangaScraper, type Manga, Chapter} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/comic\/[^/]+\/$/, 'div.comic-info-upper h1')
@Common.MangasMultiPageCSS('div.ac-grid article.ac-card h2.ac-title a', Common.PatternLinkGenerator('/comic/page/{page}/'))
@Common.PagesSinglePageCSS('div.chapter-images-outer div.images-flow img.chapter-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private nonce = '';

    public constructor() {
        super('rinkocomics', 'Rinko Comics', 'https://rinkocomics.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nonce = await FetchWindowScript<string>(new Request(this.URI), 'comicworld_ajax.nonce;', 500);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '[data-comic-id]')).at(0).dataset.comicId.trim();
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run;) {
                const { data: { html } } = await FetchJSON<{ data: { html: string; } }>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    body: new URLSearchParams({
                        action: 'load_more_chapters',
                        offset: `${offset}`,
                        comic_id: mangaId,
                        nonce: this.nonce,
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Referer: this.URI.href
                    }
                }));
                const chapters = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>('li.chapter:not(.locked-chapter) a')].map(anchor => {
                    return new Chapter(this, manga, anchor.pathname, anchor.querySelector('span.chapter-number').textContent.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
                offset += chapters.length;
            }
        }.call(this));
    }
}