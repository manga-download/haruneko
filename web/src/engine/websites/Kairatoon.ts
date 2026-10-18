import { Tags } from '../Tags';
import icon from './Kairatoon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, Fetch, FetchNextProps } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { DecryptXOR } from '../Crypto';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

type APIManga = {
    slug: string;
    title: string;
};

type JSONManga = {
    ssrWebtoon: APIManga;
    ssrChapters: {
        number: number;
        title: string;
    }[];
};

type JSONPages = {
    initialChapter: {
        _enc: string;
        pages: string[];
        page_image_paths: string[];
    };
};

export default class extends DecoratableMangaScraper {

    readonly #apiURL = `${this.URI.origin}/api/`;
    readonly #key = GetBytesFromUTF8('kaira_sec_v2_d4f91e8b3c');

    public constructor() {
        super('kairatoon', 'Kairatoon', 'https://kairatoon.net', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { ssrWebtoon: { slug, title } } = await FetchNextProps<JSONManga>(new Request(new URL(url)));
        return new Manga(this, provider, `/webtoon/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const data = await FetchJSON<APIManga[]>(new Request(new URL(`./webtoons?sort=newest&limit=24&page=${page}`, this.#apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `/webtoon/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { ssrChapters } = await FetchNextProps<JSONManga>(new Request(new URL(manga.Identifier, this.URI)));
        return ssrChapters
            .sort((self, other) => other.number - self.number)
            .map(({ number, title }) => new Chapter(this, manga, `${manga.Identifier}/bolum-${number}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { initialChapter: { _enc, pages, page_image_paths } } = await FetchNextProps<JSONPages>(new Request(new URL(chapter.Identifier, this.URI)));
        return (()=>{
            if (_enc) return <string[]>JSON.parse(GetUTF8FromBytes(DecryptXOR(GetBytesFromBase64(_enc), this.#key)));
            if (pages?.length) return pages;
            if (page_image_paths?.length) return page_image_paths;
        })().map(page => new Page(this, chapter, this.GetPageURL(page), { Referer: this.URI.href }));
    }

    private GetPageURL(page: string): URL {
        const uri = new URL(page, this.URI);
        const filename = uri.pathname.split('/').filter(Boolean).at(-1);
        const isScrambled = /^(p25_|chap)/.test(filename)
            || uri.pathname.includes('_scrambled')
            || filename.includes('-bolum-') && filename.includes('-sayfa-');

        if (isScrambled) {
            uri.pathname = `/api/files/${filename}`;
            uri.searchParams.set('scrambled', '1');
        }
        return uri;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {
            const headers = {
                'Referer': page.Parameters.Referer,
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'same-origin',
            };
            return Fetch(new Request(page.Link, { signal, headers })).then(response => response.blob());
        }, priority, signal);

        return page.Link.searchParams.get('scrambled') !== '1' ? blob : DeScramble(blob, async (image, ctx) => {
            ctx.drawImage(image, 0, 0);
            const blockWidth = Math.floor(image.width / 5);
            const blockHeight = Math.floor(image.height / 5);
            if (blockWidth >= 8 && blockHeight >= 8) {
                for (let targetIndex = 0; targetIndex < 25; targetIndex++) {
                    const targetX = targetIndex % 5 * blockWidth;
                    const targetY = Math.floor(targetIndex / 5) * blockHeight;
                    const sourceIndex = (7 * targetIndex + 11) % 25;
                    const sourceX = sourceIndex % 5 * blockWidth;
                    const sourceY = Math.floor(sourceIndex / 5) * blockHeight;
                    ctx.drawImage(image, sourceX, sourceY, blockWidth, blockHeight, targetX, targetY, blockWidth, blockHeight);
                }
            }
        });
    }
}