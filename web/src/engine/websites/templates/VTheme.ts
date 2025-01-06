//VTheme theme by V DEV : https://discord.com/invite/yz3UN72qPd

import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type APIMangas = {
    posts: APIManga[]
}

type APISingleManga = {
    post: APIManga
}

type APIManga = {
    id: number,
    slug: string,
    postTitle: string,
    chapters?: APIChapter[]
}

type APIChapter = {
    id: number,
    slug: string,
    number: number,
    title: string,
    isLocked: boolean
}

type MangaID = {
    id: string,
    slug: string,
}

const pageScript = `[...document.querySelectorAll('section img[loading]')].map(image => image.src);`;

@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export class VTheme extends DecoratableMangaScraper {
    private readonly apiUrl = new URL('/api/', this.URI);

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaSlug = url.split('/').pop();
        const { post: { id, slug, postTitle } } = await FetchJSON<APISingleManga>(new Request(new URL(`post?postSlug=${mangaSlug}`, this.apiUrl)));
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
        const { posts } = await FetchJSON<APIMangas>(new Request(new URL(`query?page=${page}&perPage=9999`, this.apiUrl)));
        return posts.map(item => new Manga(this, provider, JSON.stringify({ slug: item.slug, id: item.id }), item.postTitle));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id, slug } = JSON.parse(manga.Identifier) as MangaID;
        const { post: { chapters } } = await FetchJSON<APISingleManga>(new Request(new URL(`chapters?postId=${id}&skip=0&take=9999`, this.apiUrl)));
        return chapters ? chapters.filter(chapter => !chapter.isLocked).map(chapter => {
            const title = chapter.number + (chapter.title ? ` : ${chapter.title}` : '');
            return new Chapter(this, manga, `/series/${slug}/${chapter.slug}`, title);
        }) : [];
    }
}