import { Tags } from '../Tags';
import icon from './TheBlank.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch, FetchHTML, FetchWindowScript } from '../platform/FetchProvider';
import { GetBase64FromBytes, GetBytesFromBase64, GetBytesFromUTF8, GetHexFromBytes } from '../BufferEncoder';
import type { Priority } from '../taskpool/TaskPool';

type EntryInfo = {
    id: string;
    title: string;
};

type ListInfo = {
    entries: EntryInfo[];
    total: number;
};

type PageParameters = {
    pageIndex: number;
    chapterToken: string;
    serverPubkey: string;
};

type PageAssembly = { HEAPU8: Uint8Array } & Record<`_${string}`, (...args: number[]) => number>;

function TitleCase(title: string, keepSmallWords = false): string {
    return title.toLowerCase().replace(/\b\w+\b/g, (word, index) => keepSmallWords && index > 0 && /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|the|to)$/.test(word) ? word : word[0].toUpperCase() + word.slice(1));
}

function MangaTitle(title: string, id: string): string {
    return title
        .replace(/^_r_[^\s_]+_?/i, '')
        .replace(/\s+/g, ' ')
        .trim() || TitleCase((id.split('/').at(-1) ?? id).replace(/^[A-Za-z0-9]{10}-/, '').replace(/-/g, ' '), true);
}

const libraryListScript = `
    new Promise(async resolve => {
        const read = doc => JSON.parse(doc.querySelector('#app')?.getAttribute('data-page') || '{}').props?.series;
        const series = read(document), entries = [...(series?.data || [])], pages = series?.meta?.last_page || 1;
        for(let page = 2; page <= pages; page += 6) {
            entries.push(...(await Promise.all(Array.from({ length: Math.min(6, pages - page + 1) }, async (_, index) => {
                try {
                    const response = await fetch('/library?page=' + (page + index), { credentials: 'same-origin' });
                    return response.ok ? read(new DOMParser().parseFromString(await response.text(), 'text/html'))?.data || [] : [];
                } catch { return []; }
            }))).flat());
        }
        resolve({
            entries: entries.map(entry => ({ id: new URL(entry.link, location.href).pathname.replace(/\\/$/, ''), title: entry.title || '' }))
                .filter((entry, index, items) => items.findIndex(other => other.id === entry.id) === index),
            total: series?.meta?.total || entries.length
        });
    });
`;

const chapterScript = `
    JSON.parse(document.querySelector('#app').getAttribute('data-page')).props.serie.chapters
        .map(chapter => ({ id: location.pathname.replace(/\\/$/, '') + '/chapter/' + chapter.slug, title: chapter.title }))
        .sort((left, right) => parseFloat(right.title.match(/[\\d.]+/)[0]) - parseFloat(left.title.match(/[\\d.]+/)[0]));
`;

export default class extends DecoratableMangaScraper {

    #pageAssembly: Promise<PageAssembly>;
    #pageSession: { serverPubkey: string; clientPubkey: Promise<string> };
    #decryptionQueue: Promise<void> = Promise.resolve();

    public constructor() {
        super('theblank', 'TheBlank', 'https://theblank.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {}

    public override ValidateMangaURL(url: string): boolean {
        const uri = new URL(url);
        return uri.hostname.endsWith('theblank.net') && /^\/serie\/[^/]+\/?$/.test(uri.pathname);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.replace(/\/$/, '');
        return new Manga(this, provider, id, MangaTitle('', id));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const list = await FetchWindowScript<ListInfo>(new Request(new URL('/library', this.URI)), libraryListScript, 0, 120_000);
        if(list.entries.length < list.total) {
            throw new Error(`Incomplete library: ${list.entries.length}/${list.total}`);
        }
        return list.entries.map(({ id, title }) => new Manga(this, provider, id, MangaTitle(title, id)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchWindowScript<EntryInfo[]>(new Request(new URL(manga.Identifier, this.URI)), chapterScript, 0, 120_000);
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, TitleCase(title)));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const dom = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const { page_count: pageCount, chapter_token: chapterToken, server_pubkey: serverPubkey } = (JSON.parse(dom.querySelector('#app')?.getAttribute('data-page') ?? '{}') as { props?: {
            page_count?: number;
            chapter_token?: string;
            server_pubkey?: string;
        } }).props ?? {};
        if(!pageCount || !chapterToken || !serverPubkey) {
            return [];
        }
        return Array.from({ length: pageCount }, (_, index) => new Page(this, chapter, new URL(`${chapter.Identifier}/page/${index + 1}`, this.URI), {
            pageIndex: index + 1,
            chapterToken,
            serverPubkey
        }));
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(() => this.DecryptPage(page, signal), priority, signal);
    }

    private async DecryptPage(page: Page<PageParameters>, signal: AbortSignal): Promise<Blob> {
        const clientPubkey = await this.GetClientPubkey(page.Parameters.serverPubkey);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = GetHexFromBytes(crypto.getRandomValues(new Uint8Array(16)));
        const { pageIndex, chapterToken } = page.Parameters;
        const signature = await this.SignPageRequest(chapterToken, `${pageIndex}${timestamp}${nonce}`);
        const endpoint = new URL(page.Link);
        endpoint.search = new URLSearchParams({ token: chapterToken, ts: timestamp, nonce, sig: signature }).toString();
        const response = await Fetch(new Request(endpoint, {
            signal,
            headers: { 'X-Client-Pubkey': clientPubkey }
        }));
        if(!response.ok) {
            throw new Error(`Page fetch failed: ${response.status}`);
        }
        const encrypted = await response.blob();
        if(encrypted.size < 216) {
            throw new Error('Invalid encrypted page stream');
        }
        const header = new Uint8Array(await encrypted.slice(192, 216).arrayBuffer());
        const filename = response.headers.get('X-Page-Name') ?? '';
        const keyHint = response.headers.get('X-Key-Hint') ?? '';
        const operation = this.#decryptionQueue.then(() => {
            if(signal?.aborted) {
                throw new DOMException(null, 'AbortError');
            }
            return this.PerformPageDecryption(encrypted.slice(216), filename, keyHint, header);
        });
        this.#decryptionQueue = operation.then(() => undefined, () => undefined);
        return operation;
    }

    private async InitializePageDecryption(serverPubkey: string): Promise<string> {
        const module = await this.GetPageAssembly();
        module._ecdhDestroy();
        const serverKey = GetBytesFromBase64(serverPubkey);
        const privateKey = crypto.getRandomValues(new Uint8Array(32));
        const [privatePointer, serverPointer] = [privateKey, serverKey].map(data => this.CopyToAssembly(module, data));
        const clientPointer = module._malloc(32);
        const initialized = module._ecdhInit(privatePointer, privateKey.length, serverPointer, serverKey.length, clientPointer);
        module.HEAPU8.fill(0, privatePointer, privatePointer + privateKey.length);
        privateKey.fill(0);
        [privatePointer, serverPointer].forEach(pointer => module._free(pointer));
        if(!initialized) {
            module._free(clientPointer);
            throw new Error('Page decryption handshake failed');
        }
        const clientKey = module.HEAPU8.slice(clientPointer, clientPointer + 32);
        module._free(clientPointer);
        return GetBase64FromBytes(clientKey);
    }

    private GetClientPubkey(serverPubkey: string): Promise<string> {
        if(this.#pageSession?.serverPubkey !== serverPubkey) {
            const clientPubkey = this.#decryptionQueue.then(() => this.InitializePageDecryption(serverPubkey));
            this.#decryptionQueue = clientPubkey.then(() => undefined, () => undefined);
            this.#pageSession = { serverPubkey, clientPubkey };
        }
        return this.#pageSession.clientPubkey;
    }

    private async SignPageRequest(keyData: string, data: string): Promise<string> {
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const key = await crypto.subtle.importKey('raw', GetBytesFromUTF8(keyData), algorithm, false, ['sign']);
        return GetHexFromBytes(new Uint8Array(await crypto.subtle.sign(algorithm, key, GetBytesFromUTF8(data))));
    }

    private async PerformPageDecryption(encrypted: Blob, filename: string, keyHint: string, headerBytes: Uint8Array): Promise<Blob> {
        const module = await this.GetPageAssembly();
        const filenameBytes = GetBytesFromUTF8(filename);
        const keyHintBytes = GetBytesFromBase64(keyHint);
        const [filenamePointer, keyHintPointer, headerPointer] = [filenameBytes, keyHintBytes, headerBytes].map(data => this.CopyToAssembly(module, data));
        const initialized = module._initPageDecryption(filenamePointer, filenameBytes.length, keyHintPointer, keyHintBytes.length, headerPointer, headerBytes.length);
        module._wipeMemory(keyHintPointer, keyHintBytes.length);
        module._wipeMemory(headerPointer, headerBytes.length);
        [filenamePointer, keyHintPointer, headerPointer].forEach(pointer => module._free(pointer));
        keyHintBytes.fill(0);
        headerBytes.fill(0);
        if(!initialized) {
            throw new Error('Page decryption initialization failed');
        }
        try {
            const input = new Uint8Array(await encrypted.arrayBuffer());
            const output: Uint8Array[] = [];
            const sizePointer = module._malloc(4);
            const statusPointer = module._malloc(4);
            for(let offset = 0; offset < input.length;) {
                const chunk = input.subarray(offset, Math.min(offset + 65553, input.length));
                const chunkPointer = this.CopyToAssembly(module, chunk);
                const resultPointer = module._decryptChunk(chunkPointer, chunk.length, sizePointer, statusPointer);
                const length = new Int32Array(module.HEAPU8.buffer, sizePointer, 1)[0];
                const status = new Int32Array(module.HEAPU8.buffer, statusPointer, 1)[0];
                module._wipeMemory(chunkPointer, chunk.length);
                module._free(chunkPointer);
                if(!resultPointer || length < 0) {
                    module._free(sizePointer);
                    module._free(statusPointer);
                    throw new Error('Page decryption failed');
                }
                output.push(module.HEAPU8.slice(resultPointer, resultPointer + length));
                module._wipeMemory(resultPointer, length);
                module._freeBuffer(resultPointer);
                offset += chunk.length;
                if(status === 3) {
                    break;
                }
            }
            module._free(sizePointer);
            module._free(statusPointer);
            input.fill(0);
            return new Blob(output as BlobPart[], { type: 'image/jpeg' });
        } finally {
            module._destroyPageDecryption();
        }
    }

    private GetPageAssembly(): Promise<PageAssembly> {
        this.#pageAssembly ??= new Promise<PageAssembly>((resolve, reject) => {
            const runtime = window as Window & { PageAssemblyModule?: () => Promise<PageAssembly> };
            if(runtime.PageAssemblyModule) {
                runtime.PageAssemblyModule().then(resolve, reject);
                return;
            }
            const script = document.createElement('script');
            script.src = new URL('/wasm/pam.js', this.URI).href;
            script.onload = () => runtime.PageAssemblyModule!().then(resolve, reject);
            script.onerror = () => reject(new Error('Failed to load page assembly module'));
            document.head.appendChild(script);
        });
        return this.#pageAssembly;
    }

    private CopyToAssembly(module: PageAssembly, data: Uint8Array): number {
        const pointer = module._malloc(data.length);
        module.HEAPU8.set(data, pointer);
        return pointer;
    }
}
