import { Tags } from '../Tags';
import icon from './InkStory.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromUTF8 } from '../BufferEncoder';
import { RandomText } from '../Random';

type APIManga = {
    id: string;
    slug: string;
    name: {
        ru: string;
    }
};

type HydratedData = {
    chaptersData: HydratedChapter[];
    branches: HydratedBranch[];
    secretKey: any;
};

type HydratedChapter = {
    id: string;
    name: string;
    number: number;
    branchId: string;
    volume: number;
};

type HydratedBranch = {
    id: string;
    publishers: {
        name: string;
    }[]
};

type APIPages = {
    pages: {
        image: string;
    }[]
};

type PageParameters = {
    secretKey: string;
};

function PreloadScript(eventName: string): string {
    return `
    (function(eventName) {
            document.addEventListener('@it-astro:server-state-loaded', event => {
                setInterval(() => window.dispatchEvent(new CustomEvent(eventName, { detail: event.serverState })), 250);
            });
     })('${eventName}');`;
};

function HydratedDataScript(eventName: string) : string {
    return `
        new Promise(resolve => {
            const eventName = '${eventName}';
            window.addEventListener(eventName, event => {
                const objects = event.detail.get('@inox-tools/request-nanostores');
                const branches = objects.get('current-book-branches');
                const chaptersData = objects.get('current-book-chapters');
                const secretKey = objects.get('secret-key');
                resolve({ chaptersData, branches, secretKey });
            }, { once: true });
        });`;
};

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.inkstory.me/v2/';

    public constructor() {
        super('inkstory', 'InkStory', 'https://inkstory.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, name: { ru } } = await FetchJSON<APIManga>(new Request(new URL(`./books/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, ru);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL(`./books?page=${page}&size=200&sort=viewsCount%2Cdesc`, this.apiUrl)));
        return data.map(({ slug, name: { ru } }) => new Manga(this, provider, slug, ru));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`./content/${manga.Identifier}`, this.URI));
        const eventName = RandomText(Math.random() * 6 + 4);
        const { branches, chaptersData } = await FetchWindowPreloadScript<HydratedData>(request, PreloadScript(eventName), HydratedDataScript(eventName), 0, 7500);
        return chaptersData.map(({ id, branchId, name, number, volume }) => {
            const publishers = branches.find(branch => branch.id === branchId).publishers.map(({ name }) => name).join(' & ');
            const title = ['Том', `${volume}.`, 'Глава', number, name ? `: ${name}` : undefined].join(' ').trim() + ` (${publishers})`;
            return new Chapter(this, manga, id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const request = new Request(new URL(`./content/${chapter.Parent.Identifier}`, this.URI));
        const eventName = RandomText(Math.random() * 6 + 4);
        const { secretKey } = await FetchWindowPreloadScript<HydratedData>(request, PreloadScript(eventName), HydratedDataScript(eventName), 0, 7500);
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ image }) => {
            const url = new URL(image);
            url.search = new URLSearchParams({
                quality: '75',
                width: '700',
                type: 'jpeg'
            }).toString();
            return new Page<PageParameters>(this, chapter, url, { Referer: this.URI.href, secretKey });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return this.DecryptPicture(await blob.arrayBuffer(), page.Parameters.secretKey);
    }

    private async DecryptPicture(encrypted: ArrayBuffer, secretKey: string): Promise<Blob> {
        const algorithm = { name: 'AES-GCM', iv: encrypted.slice(0, 12)};
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(secretKey), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted.slice(12));
        return Common.GetTypedData(decrypted);
    }
}