import { Tags } from '../../Tags';
import icon from './LynxScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import { FetchJSON, FetchRequest, FetchWindowScript } from '../../FetchProvider';
import * as Common from '../decorators/Common';

const scriptGetNextId = `
  new Promise((resolve) => {
        resolve(__NEXT_DATA__.buildId);
    });
`;

type JSONResult<T> = {
    pageProps: T;
}

type JSONChapterForPages = {
    chapter: {
        pages: {
            thumb: string
        }[]
    }
}

type JSONMangaPage = {
    comic: JSONManga
}

type JSONManga = {
    id: number,
    title: string,
    titleSlug: string,
    volumes: {
        number: number,
        chapters: JSONChapter[]
    }[]
}

type JSONChapter = {
    id: number,
    number: number,
    name: string
}

type JSONMangas = {
    comics: {
        data: JSONManga[]
    }
}

type ChapterID = {
    volume: number,
    chapter: number

}

let nextBuild = '';

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('secretscans', `Lynx Scans`, 'https://lynxscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        nextBuild = await FetchWindowScript<string>(request, scriptGetNextId, 2000);
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/lynxscans\.com\/comics\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').pop();
        const uri = new URL('/_next/data/' + nextBuild + '/comics/' + slug + '.json?slug=' + slug, this.URI).href;
        const request = new FetchRequest(uri);
        const data = await FetchJSON<JSONResult<JSONMangaPage>>(request);
        return new Manga(this, provider, slug, data.pageProps.comic.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            //https://lynxscans.com/_next/data/gKykNd-Yr9A8wW05Lb2i1/comics.json
            const url = new URL('/_next/data/' + nextBuild + '/comics.json?page=' + page, this.URI).href;
            const request = new FetchRequest(url);
            const data = await FetchJSON<JSONResult<JSONMangas>>(request);
            return data.pageProps.comics.data.map(element => new Manga(this, provider, element.titleSlug, element.title.trim()));
        } catch (error) {
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL('/_next/data/' + nextBuild + '/comics/' + manga.Identifier + '.json?slug=' + manga.Identifier, this.URI).href;
        const request = new FetchRequest(new URL(url).href);
        const data = await FetchJSON<JSONResult<JSONMangaPage>>(request);
        const chapters = [];
        data.pageProps.comic.volumes.map(volume => {
            volume.chapters.map(chapter => {
                chapters.push(new Chapter(this, manga, JSON.stringify({ volume: volume.number, chapter: chapter.number }), chapter.name.trim()));
            });
        });
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaSlug = chapter.Parent.Identifier;
        const chapterID: ChapterID = JSON.parse(chapter.Identifier);
        const url = new URL(`/_next/data/${nextBuild}/comics/${mangaSlug}/volume/${chapterID.volume}/chapter/${chapterID.chapter}.json`, this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchJSON<JSONResult<JSONChapterForPages>>(request);
        return data.pageProps.chapter.pages.map(page => new Page(this, chapter, new URL(page.thumb)));
    }
}