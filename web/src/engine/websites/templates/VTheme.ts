// VTheme theme by V DEV : https://discord.com/invite/yz3UN72qPd

import { FetchJSON, FetchNextJS } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIMangas = {
    posts: APIManga[];
};

type APISingleManga = {
    post: APIManga;
};

type APIManga = {
    id: number,
    slug: string,
    postTitle: string,
    chapters?: APIChapter[];
};

type APIChapter = {
    slug: string,
    number: number,
    title: string,
    isLocked: boolean;
};

type MangaID = {
    id: string,
    slug: string,
};

type HydratedPages = {
    images: {
        url: string
    }[]
};

// TODO: Check for possible revision

@Common.ImageAjax()
export class VTheme extends DecoratableMangaScraper {

    protected apiUrl = this.URI.origin.replace('://', '://api.') + '/api/';

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { post: { id, slug, postTitle } } = await FetchJSON<APISingleManga>(new Request(new URL(`./post?postSlug=${url.split('/').pop()}`, this.apiUrl)));
        return new Manga(this, provider, JSON.stringify({ slug, id }), postTitle);
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
        const { posts } = await FetchJSON<APIMangas>(new Request(new URL(`./query?page=${page}&perPage=9999`, this.apiUrl)));
        return posts.map(({ slug, id, postTitle }) => new Manga(this, provider, JSON.stringify({ slug, id }), postTitle));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterlist: Chapter[] = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterlist.push(...chapters) : run = false;
        }
        return chapterlist;
    }

    private async GetChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const { id, slug: mangaSlug } = JSON.parse(manga.Identifier) as MangaID;
        const { post: { chapters } } = await FetchJSON<APISingleManga>(new Request(new URL(`./chapters?postId=${id}&skip=${page * 999}&take=999`, this.apiUrl)));
        return chapters ? chapters.filter(({ isLocked }) => !isLocked)
            .map(({ number, title: chapterTitle, slug}) => {
                const title = number + (chapterTitle ? ` : ${chapterTitle}` : '');
                return new Chapter(this, manga, `/series/${mangaSlug}/${slug}`, title);
            }) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        return images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}