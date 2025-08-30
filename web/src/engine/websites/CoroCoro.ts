import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import prototypes from './CoroCoro.proto?raw';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchProto } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

// TODO : Check if website provide non crypted pictures (to remove useless checks)

type TitleListView = {
    titles: {
        titles: APITitle[];
    };
};

type TitleDetailView = {
    title: APITitle;
    chapters: APIChapter[];
};

type APITitle = {
    id: number;
    name: string;
};

type APIChapter = {
    id: number;
    mainName: string;
    subName: string;
};

type ViewerView = {
    pages?: APIImage[];
    aesKey?: string;
    aesIv?: string;
};

type APIImage = {
    src: string;
};

type PageParameters = {
    keyData?: string;
    iv?: string;
};

export default class extends DecoratableMangaScraper {

    private readonly apiUrl = `${this.URI.origin}/api/csr`;

    public constructor () {
        super('corocoro', 'CoroCoro Online (コロコロオンライン)', 'https://www.corocoro.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title: { id, name } } = await this.FetchAPI<TitleDetailView>({ rq: 'title/detail', title_id: url.split('/').at(-1) }, 'TitleDetailView');
        return new Manga(this, provider, id.toString(), name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]
            .map(day => this.FetchAPI<TitleListView>({ rq: 'title/list/update_day', day }, 'TitleListView'));
        const mangaList = (await Promise.all(promises)).reduce((accumulator: Manga[], day) => {
            const mangas = day.titles.titles.map(({ id, name }) => new Manga(this, provider, id.toString(), name));
            return [ ...accumulator, ...mangas ];
        }, []);
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<TitleDetailView>({ rq: 'title/detail', title_id: manga.Identifier }, 'TitleDetailView');
        return chapters.map(({ id, mainName, subName }) => new Chapter(this, manga, id.toString(), [ mainName, subName ].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pages, aesIv, aesKey } = await this.FetchAPI<ViewerView>({ rq: 'chapter/viewer', chapter_id: chapter.Identifier }, 'ViewerView', 'PUT');
        return pages.map(({ src }) => new Page(this, chapter, new URL(src), { keyData: aesKey, iv: aesIv }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal }));
            return response.arrayBuffer();
        }, priority, signal);
        const { keyData, iv } = page.Parameters;
        return keyData && iv ? this.DecryptImage(bytes, keyData, iv) : Common.GetTypedData(bytes);
    }

    private async DecryptImage(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(keyData), algorithm, false, [ 'decrypt' ]);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return Common.GetTypedData(decrypted);
    }

    private async FetchAPI<T extends JSONElement>(searchParamsInit: Record<string, string>, messageType: string, method: string = 'GET'): Promise<T> {
        const uri = new URL(this.apiUrl);
        uri.search = new URLSearchParams(searchParamsInit).toString();
        return FetchProto<T>(new Request(uri, { method }), prototypes, messageType);
    }
}