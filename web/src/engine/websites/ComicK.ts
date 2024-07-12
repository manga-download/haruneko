import { Tags } from '../Tags';
import icon from './ComicK.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type NEXTDATA = {
    props: {
        pageProps: {
            comic: APIManga
        }
    }
}

type APIManga = {
    hid: string,
    title : string
}

type APIChapters = {
    chapters: {
        hid: string,
        title: string,
        id: number,
        vol: number,
        chap: number,
        slug: string,
        group_name: string[],
        lang: string,
    }[]
}

type APIPages = {
    chapter: {
        images: {
            url: string
        }[]
    }
}

const langMap = {
    'ar': Tags.Language.Arabic,
    'en': Tags.Language.English,
    //'uk': Tags.Language.Ukrainian,
    'es': Tags.Language.Spanish,
    'es-419': Tags.Language.Spanish,
    'ru': Tags.Language.Russian,
    'pt-br': Tags.Language.Portuguese,
    'pt': Tags.Language.Portuguese,
    'th': Tags.Language.Thai,
    'it': Tags.Language.Italian,
    'id': Tags.Language.Indonesian,
    'fr': Tags.Language.French,
    'zh': Tags.Language.Chinese,
    'zh-hk': Tags.Language.Chinese,
    'de': Tags.Language.German,
    'tr': Tags.Language.Turkish,
    'pl': Tags.Language.Polish,
    'vi': Tags.Language.Vietnamese,
    'ja': Tags.Language.Japanese,
    //'cz': Tags.Language
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.comick.fun';

    public constructor() {
        super('comick', `ComicK`, 'https://comick.io', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https:\/\/comick\.(io|cc|app|ink)\/comic\/[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const comicdata = await FetchWindowScript<NEXTDATA>(new Request(url), '__NEXT_DATA__', 2000);
        return new Manga(this, provider, comicdata.props.pageProps.comic.hid, comicdata.props.pageProps.comic.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]>{
        try {
            const data = await FetchJSON<APIManga[]>(new Request(new URL(`v1.0/search?page=${page}&limit=49`, this.apiUrl)));
            return data.map(item => {
                return new Manga(this, provider, item.hid, item.title.trim());
            });
        } catch (error) {
            return [];
        }
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const data = await FetchJSON<APIChapters>(new Request(new URL(`/comic/${manga.Identifier}/chapters?page=${page}`, this.apiUrl)));
        return data.chapters.map(item => {
            let title = '';
            if (item.vol) {
                title += `Vol. ${item.vol} `;
            }
            if (item.chap) {
                title += `Ch. ${item.chap}`;
            }
            if (item.title) {
                title += ` - ${item.title}`;
            }
            title += ` (${item.lang})`;
            if (item.group_name && item.group_name.length) {
                title += ` [${item.group_name.join(', ')}]`;
            }
            const chap = new Chapter(this, manga, item.hid, title);
            try {
                chap.Tags.push(langMap[item.lang]);
            }
            catch {
                console.log('ComicK : unable to map language ' + item.lang);
            }
            return chap;
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { images } } = await FetchJSON<APIPages>(new Request(new URL(`/chapter/${chapter.Identifier}?tachiyomi=true`, this.apiUrl)));
        return images.map(image => new Page(this, chapter, new URL(image.url), { Referer: this.URI.href }));
    }
}