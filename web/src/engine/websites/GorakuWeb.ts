import { Tags } from '../Tags';
import icon from './GorakuWeb.webp';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchNextJS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DecryptAES } from '../Crypto';

type HydratedChapters = {
    episodeList: {
        href: string;
        title: string;
    }[];
};

type HydratedPages = {
    accessKey: string;
    keyBytes?: string;
    ivBytes?: string;
    base: string;
    metadata: {
        pages: {
            filename: string;
        }[];
    };
};

type PageParams = {
    keyData?: string;
    iv?: string;
};

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, 'meta[name="twitter:title"]')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/series', '#main div.group a[href*="episode"]', anchor => ({ id: anchor.pathname, title: anchor.querySelector('h3').innerText.trim() }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gorakuweb', 'Goraku Web', 'https://gorakuweb.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga/*, Tags.Accessibility.RegionLocked*/);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodeList } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'episodeList' in data);
        return episodeList.map(({ href, title }) => new Chapter(this, manga, new URL(href, this.URI).pathname, title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParams>[]> {
        const { metadata: { pages }, accessKey, keyBytes, ivBytes, base } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'metadata' in data && 'accessKey' in data);
        return pages.map(({ filename }) => new Page<PageParams>(this, chapter, new URL(`${base}/${filename}?__token__=${accessKey}`), { keyData: keyBytes, iv: ivBytes }));
    }

    public override async FetchImage(page: Page<PageParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const bytes = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { signal }));
            return response.arrayBuffer();
        }, priority, signal);
        const { keyData, iv } = page.Parameters;
        return Common.GetTypedData(keyData && iv ? await this.Decrypt(bytes, keyData, iv) : bytes);
    }

    private async Decrypt(encrypted: ArrayBuffer, keyData: string, iv: string): Promise<ArrayBuffer> {
        return DecryptAES(encrypted, GetBytesFromHex(keyData), { name: 'AES-CBC', iv: GetBytesFromHex(iv) });
    }
}