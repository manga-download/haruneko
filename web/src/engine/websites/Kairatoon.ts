import { Tags } from '../Tags';
import icon from './Kairatoon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, Fetch, FetchNextProps } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { DecryptXOR } from '../Crypto';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

// Website is suspected to use honeypots, users reports banned accounts

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

    private readonly apiURL = `${this.URI.origin}/api/`; // Could be a honeypot, its only used in series list

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
                const data = await FetchJSON<APIManga[]>(new Request(new URL(`./webtoons?sort=newest&limit=24&page=${page}`, this.apiURL)));
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
        const pagesArray = _enc ? <string[]>JSON.parse(GetUTF8FromBytes(DecryptXOR(GetBytesFromBase64(_enc), GetBytesFromUTF8('kaira_sec_v2_d4f91e8b3c'))))
            : pages?.length > 0 ? pages
                : page_image_paths?.length > 0 ? page_image_paths : [];
        return pagesArray.map(page => new Page(this, chapter, this.CookPageURL(page), { Referer: this.URI.href }));
    }

    private CookPageURL(page: string): URL {
        const pageURL = new URL(page, this.URI);
        const filename = pageURL.pathname.split('/').filter(Boolean).at(-1);
        const isScrambled = /^(p25_|chap)/.test(filename) || /_scrambled/.test(pageURL.href) ||
            filename.includes('-bolum-') && filename.includes('-sayfa-');

        if (isScrambled) {
            pageURL.pathname = `/api/files/${filename}`;
            pageURL.searchParams.set('scrambled', '1');
        }
        return pageURL;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await this.imageTaskPool.Add(async () => {
            const headers = {
                'Referer': page.Parameters.Referer,
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Site': 'same-origin'
            };
            let response = await Fetch(new Request(page.Link, { signal, headers }));
            return await response.blob();
        }, priority, signal);

        if (page.Link.searchParams.get('scrambled') !== '1') return blob;

        return DeScramble(blob, async (image, ctx) => {
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;

            ctx.drawImage(image, 0, 0);

            const pieceWidth = Math.floor(image.width / 5);
            const pieceHeight = Math.floor(image.height / 5);

            if (pieceWidth >= 8 && pieceHeight >= 8) {
                for (let index = 0; index < 25; index++) {
                    const destX = index % 5 * pieceWidth;
                    const destY = Math.floor(index / 5) * pieceHeight;
                    const scrambleIndex = (7 * index + 11) % 25;
                    const sourceX = scrambleIndex % 5 * pieceWidth;
                    const sourceY = Math.floor(scrambleIndex / 5) * pieceHeight;
                    ctx.drawImage(image, sourceX, sourceY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
                }
            }
        });
    }
}