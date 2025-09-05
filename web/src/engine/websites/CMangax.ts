import { Tags } from '../Tags';
import icon from './CMangax.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: APIManga[]
};

type APIManga = {
    info: string
}

type MangaInfos = {
    id: string,
    name: string
}

type APIChapter = {
    id_chapter: string,
    info: string
}

type ChapterInfos = {
    name: string,
    num : string
}

type APIPages = {
    image: string[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/`;

    public constructor() {
        super('cmangax', 'CMangax', 'https://cmangax4.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/album/[^/]+-\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaID = url.match(/-(\d+)$/).at(1);
        const { info } = await FetchJSON<APIManga>(new Request(new URL(`./get_data_by_id?id=${mangaID}&table=album&data=info`, this.apiUrl)));
        const { id, name } = JSON.parse(info) as MangaInfos;
        return new Manga(this, provider, id, name);
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
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./home_album_list?limit=1000&page=${page}`, this.apiUrl)));
        return data.map(item => JSON.parse(item.info) as MangaInfos)
            .filter(mangaInfos => mangaInfos.id)
            .map(mangaInfos => new Manga(this, provider, mangaInfos.id, mangaInfos.name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./chapter_list?album=${manga.Identifier}&limit=9999`, this.apiUrl)));
        return chapters.map(chapter => {
            const { num, name } = JSON.parse(chapter.info) as ChapterInfos;
            return new Chapter(this, manga, chapter.id_chapter, name.trim() || num.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { image } = await FetchJSON<APIPages>(new Request(new URL(`./chapter_image?chapter=${chapter.Identifier}`, this.apiUrl)));
        return image.map(page => new Page(this, chapter, new URL(page)));
    }
}