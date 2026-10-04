import { Tags } from '../Tags';
import icon from './AnimeXNovel.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// TODO : Add novel+anime support

type APIChapter = {
    id: number;
    link: string;
    title: string;
};

@Common.MangaCSS(/^{origin}\/man(ga|hua|hwa)\/[^/]+\/$/, 'span.kadence-bread-current')
@Common.PagesSinglePageCSS('figure img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('animexnovel', 'Anime X Novel', 'https://www.animexnovel.com', Tags.Media.Novel, Tags.Media.Anime, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const form = new URLSearchParams({
            'action': 'axn_filter_obras',
            'posts_per_page': '100',
            'paged': '1',
            'search': ''
        });

        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                form.set('paged', `${page}`);
                const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`/wp-admin/admin-ajax.php`, this.URI), {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    body: form.toString()
                }), 'a.axn-card');
                const mangas = elements
                    .filter(({ pathname }) => /^\/man(ga|hu|hw)a\//.test(pathname))
                    .map(anchor => new Manga(this, provider, anchor.pathname, anchor.querySelector('.axn-titulo').textContent.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'div[data-categoria]')).at(0).dataset.categoria.trim();
        const posts = await FetchJSON<APIChapter[]>(new Request(new URL(`./wp-json/axn/v1/chapters/${mangaId}?per_page=5000&page=1`, this.URI)));
        return posts
            .filter(({ link }) => link != new URL(manga.Identifier, this.URI).href)
            .filter(({ title }) => title != manga.Title)
            .map(({ title, link }) => new Chapter(this, manga, new URL(link).pathname, title.replace(manga.Title, '').replace(/\s+–\s+/, '') || title))
            .reverse();
    }
}