import { Tags } from '../Tags';
import icon from './PlotTwistNoFansub.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import type { Manga } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    data: {
        html: string;
        has_more: boolean;
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.mn-detail-title')
@Common.MangasMultiPageCSS('div.manga-grid-v2 figure > a', Common.PatternLinkGenerator('/biblioteca3/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.reading-content img[data-src]')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('plottwistnofansub', 'Plot Twist No Fansub', 'https://plotnofansub.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), 'manga.manga_id', 500);
        const body = new FormData();
        body.set('action', 'plot_load_chapters');
        body.set('manga_id', mangaId);

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                body.set('page', `${page}`);
                const { data: { html, has_more } } = await FetchJSON<APIChapters>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    body,
                }));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('a.mn-detail-chapter-item')].map(chapter => {
                    return new Chapter(this, manga, chapter.pathname, [
                        chapter.querySelector('.mn-detail-chapter-name').textContent.trim(),
                        chapter.querySelector('.mn-detail-chapter-extend').textContent.trim(),
                    ].filter(Boolean).join(' ').trim());
                });
                yield* chapters;
                run = has_more;
            }
        }.call(this));
    }
}