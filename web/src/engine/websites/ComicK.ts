import { Tags } from '../Tags';
import icon from './ComicK.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    hid: string,
    title: string
}

type APIChapters = {
    chapters: APIChapter[]
}

type APISingleChapter = {
    chapter: APIChapter
}

type APIChapter = {
    hid: string,
    title: string,
    vol: number,
    chap: number,
    group_name: string[],
    lang: string,
    md_images: APIPage[]
}

type APIPage = {
    b2key: string,
    name: string,
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

@Common.ImageAjax(true)
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
        const manga = await FetchWindowScript<APIManga>(new Request(url), '__NEXT_DATA__.props.pageProps.comic', 2000);
        return new Manga(this, provider, manga.hid, manga.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const data = await FetchJSON<APIManga[]>(new Request(new URL(`v1.0/search?page=${page}&limit=49`, this.apiUrl)));
            return data.map(item => new Manga(this, provider, item.hid, item.title.trim()));
        } catch { // TODO: Do not return empty list for generic errors
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
        const { chapters: entries } = await FetchJSON<APIChapters>(new Request(new URL(`/comic/${manga.Identifier}/chapters?page=${page}`, this.apiUrl)));
        return entries.map(item => {
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
            const chapter = new Chapter(this, manga, item.hid, title);
            try {
                chapter.Tags.Value.push(langMap[item.lang]);
            }
            catch {}
            return chapter;
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { md_images } } = await FetchJSON<APISingleChapter>(new Request(new URL(`/chapter/${chapter.Identifier}`, this.apiUrl)));
        return md_images.map(image => new Page(this, chapter, new URL(image.b2key, `https://s3.comick.ink/comick/`), { Referer: this.URI.href }));
    }
}