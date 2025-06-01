import { Tags } from '../Tags';
import icon from './GorakuWeb.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import { GetBytesFromHex } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';

type HydratedEpisodeData = {
    episodeList: {
        href: string,
        title: string,
    }[]
};

type HydratedPageData = {
    accessKey: string,
    keyBytes?: string,
    ivBytes?: string,
    base: string,
    metadata: {
        pages: {
            filename: string
        }[]
    }
}

type PageParams = {
    keyData?: string,
    iv?: string
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, 'meta[name="twitter:title"]')
@Common.MangasSinglePagesCSS([ '/series' ], '#main div.group a[href*="episode"]', (a: HTMLAnchorElement) => ({ id: a.pathname, title: a.querySelector('h3').innerText.trim() }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gorakuweb', 'Goraku Web', 'https://gorakuweb.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga/*, Tags.Accessibility.RegionLocked*/);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodeList } = await this.FetchFlightDataNextJS<HydratedEpisodeData>(manga.Identifier, data => data['episodeList']);
        return episodeList.map(chapter => new Chapter(this, manga, new URL(chapter.href, this.URI).pathname, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParams>[]> {
        const { metadata: { pages }, accessKey, keyBytes, ivBytes, base } = await this.FetchFlightDataNextJS<HydratedPageData>(chapter.Identifier, data => data['metadata'] && data['accessKey']);
        return pages.map(page => new Page<PageParams>(this, chapter, new URL(`${base}/${page.filename}?__token__=${accessKey}`), { keyData: keyBytes, iv: ivBytes }));
    }

    public override async FetchImage(page: Page<PageParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return page.Parameters.keyData ? this.DecryptImage(data, page.Parameters) : data;
    }

    private async DecryptImage(encrypted: Blob, page: PageParams): Promise<Blob> {
        const algorithm = { name: 'AES-CBC', iv: GetBytesFromHex(page.iv) };
        const key = await crypto.subtle.importKey('raw', GetBytesFromHex(page.keyData), algorithm, false, [ 'decrypt' ]);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, await encrypted.arrayBuffer());
        return Common.GetTypedData(decrypted);
    }

    private async FetchFlightDataNextJS<T extends JSONElement>(endpoint: string, predicate: (data: JSONElement) => unknown): Promise<T> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(endpoint, this.URI)), 'script:not([src])');
        return scripts
            .map(script => script.text)
            .filter(script => script.includes('self.__next_f.push'))
            .map(script => {
                // TODO: This is an extremely flakey extractor for NextJS flight data which needs much improvement for generic use
                try {
                    const content = JSON.parse(script.slice(script.indexOf(',"') + 1, -2)) as string;
                    return JSON.parse(content.slice(content.indexOf(':') + 1)).at(-1) as T;
                } catch {
                    return {} as T;
                }
            })
            .find(predicate);
    }
}