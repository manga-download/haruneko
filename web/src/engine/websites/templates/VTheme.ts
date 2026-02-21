// VTheme theme by V DEV : https://discord.com/invite/yz3UN72qPd

import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIManga = {
    post: {
        id: number;
        postTitle: string;
    };
};

type APIMangas = {
    posts: APIManga['post'][];
};

type APIChapters = {
    post: {
        chapters: {
            slug: string;
            number: number;
            title: string;
            isLocked: boolean;
            chapterPurchased: boolean;
            mangaPost: {
                slug: string;
            };
        }[];
    };
};

@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        const images = [ ...document.querySelectorAll('.image-container img[data-image-index]') ];
        setInterval(() => {
            images.forEach(img => img.scrollIntoView());
            const sources = images.map(img => img.src || '');
            if(!sources.some(src => src === '')) resolve(sources);
        }, 250);
    });
`, 750)
@Common.ImageAjax(true)
export class VTheme extends DecoratableMangaScraper {

    private readonly apiURL = new URL('//api.' + this.URI.hostname + '/api/', this.URI);

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { post: { id, postTitle } } = await FetchJSON<APIManga>(new Request(new URL('./post?postSlug=' + url.split('/').at(-1), this.apiURL)));
        return new Manga(this, provider, `${id}`, postTitle);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { posts } = await FetchJSON<APIMangas>(new Request(new URL('./query?perPage=9999&page=' + page, this.apiURL)));
                const mangas = posts.map(({ id, postTitle }) => new Manga(this, provider, `${id}`, postTitle));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                const { post: { chapters: chaptersData } } = await FetchJSON<APIChapters>(new Request(new URL(`./chapters?postId=${manga.Identifier}&take=999&skip=${page * 999}`, this.apiURL)));
                const chapters = chaptersData
                    .filter(({ isLocked, chapterPurchased }) => !isLocked || chapterPurchased)
                    .map(({ number, title, slug: chapterSlug, mangaPost: { slug: mangaSlug } }) => {
                        title = 'Chapter ' + number + (title ? ` - ${title}` : '');
                        return new Chapter(this, manga, `/series/${mangaSlug}/${chapterSlug}`, title);
                    });
                chapters.length > 0 ? yield* chapters : run = false;
            }

        }.call(this));
    }

    private async GetChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const { post: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./chapters?postId=${manga.Identifier}&take=999&skip=${page * 999}`, this.apiURL)));
        return chapters
            .filter(({ isLocked, chapterPurchased }) => !isLocked || chapterPurchased)
            .map(({ number, title, slug: chapterSlug, mangaPost: { slug: mangaSlug } }) => {
                title = 'Chapter ' + number + (title ? ` - ${title}` : '');
                return new Chapter(this, manga, `/series/${mangaSlug}/${chapterSlug}`, title);
            });
    }
}