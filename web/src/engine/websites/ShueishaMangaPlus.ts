import { Tags } from '../Tags';
import icon from './ShueishaMangaPlus.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './ShueishaMangaPlus.proto?raw';
import { FetchProto } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type MangaPlusResponse = {
    success: {
        titleDetailView: TitleDetailView;
        allTitlesViewV2: AllTitlesViewV2
        mangaViewer: MangaViewer;
    }
}

type AllTitlesViewV2 = {
    alltitlegroups: AllTitlesGroup[]
}

type AllTitlesGroup = {
    thetitle: string,
    titles: Title[]
}

type Title = {
    titleId: number,
    name: string,
    language: number
}

type TitleDetailView = {
    title: Title
    chapterListGroup: ChapterGroup[]
}

type ChapterGroup = {
    firstChapterList: APIChapter[],
    midChapterList: APIChapter[],
    lastChapterList: APIChapter[]
}

type APIChapter = {
    chapterId: number,
    name: string,
    subTitle: string
}
type MangaViewer = {
    pages: MangaPage[]
}

type MangaPage = {
    mangaPage: {
        imageUrl: string,
        encryptionKey: string;
    }
}

export default class extends DecoratableMangaScraper {
    private apiURL = 'https://jumpg-webapi.tokyo-cdn.com';

    public constructor() {
        super('shueishamangaplus', `MANGA Plus by Shueisha`, 'https://mangaplus.shueisha.co.jp', Tags.Media.Manga, Tags.Language.Spanish, Tags.Language.French, Tags.Language.Indonesian, Tags.Language.Portuguese, Tags.Language.Russian, Tags.Language.Thai, Tags.Language.Vietnamese, Tags.Language.German, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    private GetLanguage(language): string {
        const languages = {
            0: ['en'], 1: '[es]', 2: '[fr]', 3: '[id]', 4: '[pt-br]', 5: '[ru]', 6: '[th]', 7: '[de]', 8: '[unk]', 9: '[vi]'
        };
        return languages[language] || '[en]';
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/titles/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const titleId = url.match(/\/titles\/(\d+)/)[1];
        const uri = new URL('/api/title_detailV3', this.apiURL);
        uri.searchParams.set('title_id', titleId);
        const data = await FetchProto<MangaPlusResponse>(new Request(uri), protoTypes, 'MangaPlus.Response');
        const title = `${data.success.titleDetailView.title.name} ${this.GetLanguage(data.success.titleDetailView.title.language)}`;
        return new Manga(this, provider, titleId, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] =[];
        const request = new Request(new URL('/api/title_list/allV2', this.apiURL).href);
        const data = await FetchProto<MangaPlusResponse>(request, protoTypes, 'MangaPlus.Response');
        for (const group of data.success.allTitlesViewV2.alltitlegroups) {
            mangalist.push(...group.titles.map(manga => new Manga(this, provider, manga.titleId.toString(), `${manga.name} ${this.GetLanguage(manga.language)}`)));
        }
        return mangalist;

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL('/api/title_detailV3', this.apiURL);
        uri.searchParams.set('title_id', manga.Identifier);
        const data = await FetchProto<MangaPlusResponse>(new Request(uri), protoTypes, 'MangaPlus.Response');

        const chaptersList : Chapter[] = data.success.titleDetailView.chapterListGroup.reduce((accumulator: Chapter[], entry) => {
            const chapters = [...entry.firstChapterList || [],
                ...entry.midChapterList || [],
                ...entry.lastChapterList || [],
            ].map(chapter => new Chapter(this, manga, chapter.chapterId.toString(), chapter.subTitle || chapter.name));
            accumulator.push(...chapters);
            return accumulator;
        }, []);

        return chaptersList;

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL('/api/manga_viewer', this.apiURL);
        uri.searchParams.set('chapter_id', chapter.Identifier);
        uri.searchParams.set('img_quality', 'super_high');
        uri.searchParams.set('split', 'yes');
        const data = await FetchProto<MangaPlusResponse>(new Request(uri), protoTypes, 'MangaPlus.Response');
        return data?.success.mangaViewer ? data.success.mangaViewer.pages
            .filter(page => page.mangaPage)
            .map(image => new Page(this, chapter, new URL(image.mangaPage.imageUrl), { encryptionKey: image.mangaPage.encryptionKey })) : [];
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        const key: string = page.Parameters['encryptionKey'] as string;
        if (!key) return data;
        const encrypted = await data.arrayBuffer();
        const decrypted = XORDecrypt(new Uint8Array(encrypted), key);
        return new Blob([decrypted], { type: data.type });
    }
}

function XORDecrypt(encrypted: Uint8Array, key: string) {
    if (key) {
        const t = new Uint8Array(key.match(/.{1,2}/g).map(e => parseInt(e, 16)));
        const s = new Uint8Array(encrypted);
        for (let n = 0; n < s.length; n++) {
            s[n] ^= t[n % t.length];
        }
        return s;
    } else {
        return encrypted;
    }
}