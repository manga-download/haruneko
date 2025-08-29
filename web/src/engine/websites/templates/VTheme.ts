// VTheme theme by V DEV : https://discord.com/invite/yz3UN72qPd

import { FetchJSON, FetchNextJS } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../../providers/MangaPlugin';
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
            mangaPost: {
                slug: string;
            };
        }[];
    };
};

type HydratedPages = {
    images: {
        url: string;
        order: number;
    }[]
};

@Common.ImageAjax()
export class VTheme extends DecoratableMangaScraper {
    protected useAlternativeSorting: boolean = false;

    private readonly apiUrl = (() => {
        const uri = new URL(this.URI);
        uri.hostname = 'api.' + uri.hostname;
        uri.pathname = '/api/';
        return uri;
    })();

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { post: { id, postTitle } } = await FetchJSON<APIManga>(new Request(new URL('./post?postSlug=' + url.split('/').at(-1), this.apiUrl)));
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
        const { posts } = await FetchJSON<APIMangas>(new Request(new URL('./query?perPage=9999&page=' + page, this.apiUrl)));
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
        const { post: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./chapters?take=999&skip=${page * 999}&postId=${manga.Identifier}`, this.apiUrl)));
        return chapters
            .filter(({ isLocked }) => !isLocked)
            .map(({ number, title, slug: chapterSlug, mangaPost: { slug: mangaSlug } }) => {
                title = 'Chapter ' + number + (title ? ` - ${title}` : '');
                return new Chapter(this, manga, `/series/${mangaSlug}/${chapterSlug}`, title);
            });
    }

    private ToNumber(text: string): number {
        return /(\d+)/.test(text) ? parseInt(text.match(/(\d+)/).at(1)) : Number.POSITIVE_INFINITY;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        if (this.useAlternativeSorting) {
            images.sort((self, other) => {
                const selfEnd = self.url.split('/')?.at(-1) ?? '';
                const otherEnd = other.url.split('/')?.at(-1) ?? '';
                const selfOrder = this.ToNumber(selfEnd);
                const otherfOrder = this.ToNumber(otherEnd);
                return selfOrder !== otherfOrder ? selfOrder - otherfOrder : selfEnd.localeCompare(otherEnd);
            });
        } else {
            images.sort((self, other) => (self.order || 0) - (other.order || 0));
        }
        return images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}