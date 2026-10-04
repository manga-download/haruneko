import { Tags } from '../Tags';
import icon from './MangasBrasuka.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64, GetBytesFromURLBase64, GetUTF8FromBytes } from '../BufferEncoder';
import { DecryptXOR } from '../Crypto';

type HydratedMangas = {
    series: {
        slug: string;
        title: string;
    }[];
};

type HydratedManga = {
    chapters: {
        number: string;
    }[];
};

type HydratedPages = {
    pages: {
        url: string;
    }[];
};

type PageData = {
    cryptedUrl: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {

    private readonly apiURL: string;

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('mangasbrasuka', 'Mangas Brasuka', 'https://mangasbrasuka.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
        }

        this.apiURL = `${this.URI.origin}/api/`;
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mnx_adulto', '1')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchNextJS<HydratedMangas>(new Request(new URL('/catalogo', this.URI)), data => 'series' in data);
        return series.map(({ slug, title }) => new Manga(this, provider, `/manga/${slug}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedManga>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ number }) => new Chapter(this, manga, `${manga.Identifier}/ler/${number}`, `Capítulo ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterURL = new URL(chapter.Identifier, this.URI);
        await FetchWindowScript<void>(new Request(chapterURL), `
            new Promise(async (resolve, reject) => {
                try {
                    await window.cookieStore.set('mnx_gate_${chapter.Identifier.split('/').at(-1)}', '1');
                    resolve();
                } catch(error) {
                    reject(error);
                }
            });
        `);
        const { pages } = await FetchNextJS<HydratedPages>(new Request(chapterURL), data => 'pages' in data);
        return pages.map(({ url }) => new Page<PageData>(this, chapter, this.URI, { cryptedUrl: url, Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { cryptedUrl } = page.Parameters;
        if (cryptedUrl.startsWith('http')) {
            page.Link.href = new URL(cryptedUrl).href;
        } else {
            const decoded = GetBytesFromURLBase64(cryptedUrl);

            // Get XOR KEY
            const v = decoded[0];
            const e = new DataView(decoded.buffer, decoded.byteOffset + 1).getUint32(0, false);

            const { k } = await FetchJSON<{ k: string }>(new Request(new URL(`./atfield/key?v=${v}&e=${e}`, this.apiURL)));
            const keyData = GetBytesFromBase64(k);

            const seed = decoded.subarray(5, 13);
            const xoredData = decoded.subarray(13);

            const xorKey = await this.ComputeKey(keyData, seed, xoredData.length);
            page.Link.href = GetUTF8FromBytes(DecryptXOR(xoredData, xorKey));
        }
        return Common.FetchImageAjax.call(this, page, priority, signal, true);
    }

    private async ComputeKey(keyMaterial: Uint8Array, seed: Uint8Array, length: number): Promise<Uint8Array> {
        const cryptoKey = await crypto.subtle.importKey('raw', keyMaterial.slice(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

        const outputBuffer = new Uint8Array(length);
        let offset = 0;
        let counter = 0;

        while (offset < length) {
            const counterBuffer = new Uint8Array(seed.length + 1);
            counterBuffer.set(seed, 0);
            counterBuffer[seed.length] = counter & 255;

            const hmacDigest = new Uint8Array(await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer));

            const bytesToCopy = Math.min(hmacDigest.length, length - offset);
            outputBuffer.set(hmacDigest.subarray(0, bytesToCopy), offset);

            offset += bytesToCopy;
            counter++;
        }
        return outputBuffer;
    }
}