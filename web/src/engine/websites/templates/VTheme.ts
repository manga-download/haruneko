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
`)
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
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { posts } = await FetchJSON<APIMangas>(new Request(new URL('./query?perPage=9999&page=' + page, this.apiURL)));
        return posts.map(({ id, postTitle }) => new Manga(this, provider, `${id}`, postTitle));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
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