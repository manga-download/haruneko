import { Tags } from '../Tags';
import icon from './CMangax.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        info: string;
    }[]
};

type MangaInfo = {
    id: string;
    name: string;
}

type APIChapter = {
    id_chapter: string;
    info: string;
}

type ChapterInfo = {
    num: string;
}

type APIPages = {
    image: string[];
}

@Common.MangaCSS(/^https:\/\/cmangax\d+.com\/album\/[^/]+-\d+$/, 'h1 p.name', (paragraph, uri) => ({ id: uri.pathname.split('-').at(-1), title: paragraph.innerText.trim() }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private get ResourceURL() {
        return `${this.URI.origin}/api/`;
    }

    public constructor() {
        super('cmangax', 'CMangax', 'https://cmangax6.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
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
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./home_album_list?limit=1000&page=${page}`, this.ResourceURL)));
        return data.map(item => JSON.parse(item.info) as MangaInfo)
            .filter(({ id }) => id)
            .map(({ id, name }) => new Manga(this, provider, id, name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapter[]>(new Request(new URL(`./chapter_list?limit=9999&album=${manga.Identifier}`, this.ResourceURL)));
        return chapters.map(chapter => {
            const { num } = JSON.parse(chapter.info) as ChapterInfo;
            return new Chapter(this, manga, chapter.id_chapter, 'Chapter ' + num.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { image } = await FetchJSON<APIPages>(new Request(new URL(`./chapter_image?chapter=${chapter.Identifier}`, this.ResourceURL)));
        return image.map(link => new Page(this, chapter, new URL(link)));
    }
}