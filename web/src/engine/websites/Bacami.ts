import { Tags } from '../Tags';
import icon from './Bacami.webp';
import { DecoratableMangaScraper, type Chapter, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';
import { HashUTF8 } from '../Crypto';
import { GetHexFromBytes } from '../BufferEncoder';

type PostData = {
    timeSeed: number;
    nonce: number;
    lettersStr: string;
};

type APIMangas = {
    data: {
        html: string;
    };
};

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'div.manga-details h1.manga-title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.ch-link', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.text.split(' – ').at(-1).trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacami', 'Bacami', 'https://v1.bacami.site', Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /imageUrls\s*:\s*(\[[\s\S]*?\])/g);
        return (<string[]>JSON.parse(data)).map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.fromAsync(async function* (this: This) {
            for (const letterschunk of letters.match(/.{1,3}/g)) {
                const lettersToLoad = letterschunk.split('');

                let postData: PostData | null = null;
                while (postData === null) {
                    postData = await this.#ComputePostData(lettersToLoad);
                }

                const { timeSeed, nonce, lettersStr } = postData;

                const body = new FormData();
                body.set('action', 'load_more_komik');
                body.set('timeSeed', `${timeSeed}`);
                body.set('pow_nonce', `${nonce}`);
                body.set('letters', lettersStr);

                const { data: { html } } = await FetchJSON<APIMangas>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    method: 'POST',
                    body,
                }));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const mangas = [...doc.querySelectorAll<HTMLAnchorElement>('ul li a.series')].map(manga => new Manga(this, provider, manga.pathname, manga.text.trim()));
                yield* mangas;
            }
        }.call(this));
    }

    async #ComputePostData(letters: string[]): Promise<PostData | null> {
        const timeSeed = Math.floor(Date.now() / 1000);
        const lettersStr = JSON.stringify(letters);

        for (let nonce = 0, run = true; run && nonce < 500000; nonce++) {
            const data = GetHexFromBytes(await HashUTF8('SHA-256', `${timeSeed}_${lettersStr}_${nonce}`));
            if (data.startsWith('0000')) {
                return { timeSeed, nonce, lettersStr };
            }
        }
        return null;
    }
}