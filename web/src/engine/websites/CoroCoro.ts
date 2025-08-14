import { Tags } from '../Tags';
import icon from './CoroCoro.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromHex } from '../BufferEncoder';
import prototypes from './CoroCoro.proto?raw';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

// TODO : Check if website provide non crypted pictures (to remove useless checks)

type TitleListView = {
    titles: {
        titles: APITitle[]
    }
};

type TitleDetailView = {
    title: APITitle,
    chapters: APIChapter[]
};

type APITitle = {
    id: number,
    name: string
};

type APIChapter = {
    id: number,
    mainName: string,
    subName: string
};

type ViewerView = {
    pages?: APIImage[],
    aesKey: string,
    aesIv: string
};

type APIImage = {
    src: string
};

type PageParameters = null | {
    keyData: string,
    iv: string,
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/csr`;

    public constructor() {
        super('corocoro', 'CoroCoro Online (コロコロオンライン)', 'https://www.corocoro.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { title: { id, name } } = await this.FetchAPI<TitleDetailView>(`?rq=title/detail&title_id=${url.split('/').at(-1)}`, 'TitleDetailView');
        return new Manga(this, provider, id.toString(), name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => {
            return this.FetchAPI<TitleListView>(`?rq=title/list/update_day&day=${day}`, 'TitleListView');
        });
        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], day) => {
            const mangas = day.titles.titles.map(({ id, name }) => new Manga(this, provider, id.toString(), name));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await this.FetchAPI<TitleDetailView>(`?rq=title/detail&title_id=${manga.Identifier}`, 'TitleDetailView');
        return chapters.map(({ id, mainName, subName }) => new Chapter(this, manga, id.toString(), [mainName, subName].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { pages, aesIv, aesKey } = await this.FetchAPI<ViewerView>(`?rq=chapter/viewer&chapter_id=${chapter.Identifier}`, 'ViewerView', 'PUT');
        if (!pages) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        const params: PageParameters = aesIv && aesKey ? { keyData: aesKey, iv: aesIv } : null;
        return pages.map(({ src }) => new Page(this, chapter, new URL(src), params));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        if (!page.Parameters.keyData) return blob;
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(page.Parameters.iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(page.Parameters.keyData), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, await blob.arrayBuffer());
        return Common.GetTypedData(decrypted);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, messageType: string, method: string = 'GET'): Promise<T> {
        return FetchProto<T>(new Request(new URL(endpoint, this.apiUrl), { method }), prototypes, messageType);
    }
}