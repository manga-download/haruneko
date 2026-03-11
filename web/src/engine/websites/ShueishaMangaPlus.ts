import { Tags } from '../Tags';
import icon from './ShueishaMangaPlus.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './ShueishaMangaPlus.proto?raw';
import { FetchProto } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';
import { GetTypedData } from './decorators/Common';

type MangaPlusResponse = {
    success: {
        titleDetailView: TitleDetailView;
        allTitlesViewV2: AllTitlesViewV2;
        mangaViewer: MangaViewer;
    }
};

type AllTitlesViewV2 = {
    alltitlegroups: AllTitlesGroup[];
};

type AllTitlesGroup = {
    thetitle: string;
    titles: Title[];
};

type Title = {
    titleId: number;
    name: string;
    language: number;
};

type TitleDetailView = {
    title: Title;
    chapterListGroup: ChapterGroup[];
};

type ChapterGroup = {
    firstChapterList: APIChapter[];
    midChapterList: APIChapter[];
    lastChapterList: APIChapter[];
};

type APIChapter = {
    chapterId: number;
    name: string;
    subTitle: string;
};

type MangaViewer = {
    pages: MangaPage[];
};

type MangaPage = {
    mangaPage: {
        imageUrl: string;
        encryptionKey: string;
    }
};

type PageData = {
    encryptionKey: string;
};

export default class extends DecoratableMangaScraper {
    private apiURL = 'https://jumpg-webapi.tokyo-cdn.com/api/';

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
        return new RegExpSafe(`^${this.URI.origin}/titles/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const titleId = url.match(/\/titles\/(\d+)/).at(1);
        const { success: { titleDetailView: { title: { name, language } } } } = await FetchProto<MangaPlusResponse>(new Request(new URL(`./title_detailV3?title_id=${titleId}`, this.apiURL)), protoTypes, 'MangaPlus.Response');
        const title = `${name} ${this.GetLanguage(language)}`;
        return new Manga(this, provider, titleId, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        const { success: { allTitlesViewV2: { alltitlegroups } } } = await FetchProto<MangaPlusResponse>(new Request(new URL('./title_list/allV2', this.apiURL)), protoTypes, 'MangaPlus.Response');
        for (const group of alltitlegroups) {
            mangalist.push(...group.titles.map(({ name, titleId, language }) => new Manga(this, provider, `${titleId}`, `${name} ${this.GetLanguage(language)}`)));
        }
        return mangalist;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { success: { titleDetailView: { chapterListGroup } } } = await FetchProto<MangaPlusResponse>(new Request(new URL(`./title_detailV3?title_id=${manga.Identifier}`, this.apiURL)), protoTypes, 'MangaPlus.Response');
        const chaptersList : Chapter[] = chapterListGroup.reduce((accumulator: Chapter[], entry) => {
            const chapters = [...entry.firstChapterList || [],
                ...entry.midChapterList || [],
                ...entry.lastChapterList || [],
            ].map(({ chapterId, subTitle, name }) => new Chapter(this, manga, `${chapterId}`, subTitle || name));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
        return chaptersList;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const { success: { mangaViewer: { pages } } } = await FetchProto<MangaPlusResponse>(new Request(new URL(`./manga_viewer?chapter_id=${chapter.Identifier}&img_quality=super_high&split=yes`, this.apiURL)), protoTypes, 'MangaPlus.Response');
        return pages ? pages
            .filter(page => page.mangaPage)
            .map(({ mangaPage: { imageUrl, encryptionKey } }) => new Page<PageData>(this, chapter, new URL(imageUrl), { encryptionKey })) : [];
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.encryptionKey ? blob : this.DecryptImage(blob, page.Parameters.encryptionKey);
    }

    private async DecryptImage(blob: Blob, key: string): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = new Uint8Array(GetBytesFromHex(key));
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % xorkey.length];
        return GetTypedData(bytes.buffer);
    }
}