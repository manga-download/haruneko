import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';

type APIChapters = {
    items: {
        slug: string;
        title: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('a[href*="/manga/"]:not([data-state])', Common.PatternLinkGenerator('/manga?page={page}'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://cdn.doujindesu.dev/api/';

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://doujindesu.tv', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const mangaUrl = new URL(manga.Identifier, this.URI);
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIChapters>(new Request(new URL(`./api/manga/${manga.Identifier.split('/').at(-1)}/chapters?page=${page}`, this.URI), { headers: { Referer: mangaUrl.href } }));
                const chapters = !items ? [] : items.map(({ title, slug }) => new Chapter(this, manga, `${slug}`, title.replace(manga.Title, '').trim() || title.trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const key = 'youdoZFFxQusvsva1iHsbccZbpUAjoqB6niUyntkn5mocg2DZ0fCw1Zoow';
        const { images } = await FetchJSON<{ images: string[] }>(new Request(new URL(`./ch.php?slug=${chapter.Identifier}`, this.apiUrl), {
            headers: {
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        }));
        return images.map(image => new Page(this, chapter, new URL(this.DecryptPage(image, key))));
    }

    private DecryptPage(cryptedImage: string, keyString: string): string {
        const key: Uint8Array = GetBytesFromUTF8(keyString);
        const padding = (4 - cryptedImage.length % 4) % 4;
        const decoded: Uint8Array = GetBytesFromBase64((cryptedImage + '='.repeat(padding)).replace(/-/g, '+').replace(/_/g, '/'));
        return new TextDecoder().decode(decoded.map((byte, index) => byte ^ key[index % key.length]));
    }
}
