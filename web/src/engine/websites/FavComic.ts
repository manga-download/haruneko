import { Tags } from '../Tags';
import icon from './FavComic.webp';
import { type MangaPlugin, type Manga, type Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromBase64 } from '../BufferEncoder';

type PagesData = {
    images: string[];
    network: number;
    base64Key: string;
};

type PageKey = {
    key: string;
};

@Common.MangaCSS(/^{origin}\/comic\/detail\/\d+$/, 'div.comic_title')
@Common.ChaptersSinglePageCSS('div.catalog_box div.right_box a.item_box', undefined, Common.AnchorInfoExtractor(true))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('favcomic', 'FavComic', 'https://www.favcomic.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of 'aeiouy'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'ul.comic_list li div.cover_box a', Common.PatternLinkGenerator(`/search?keyword=${letter}&page={page}`), 0, Common.AnchorInfoExtractor(true));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageKey>[]> {
        const { images, base64Key, network } = await FetchWindowScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                resolve({ images: chapter.imageUrls, network, base64Key });
            });`
        , 1500);
        return images.map(image => new Page<PageKey>(this, chapter, new URL(image), { key: network === 2 ? base64Key : '' }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.key ? blob : this.DecryptImage(await blob.arrayBuffer(), page.Parameters.key);

    }
    private async DecryptImage(buffer: ArrayBuffer, key: string): Promise<Blob> {
        const message = new Uint8Array(buffer);
        const algorithm = { name: 'AES-CBC', iv: message.slice(0, 16) };
        const decryptionKey = await crypto.subtle.importKey('raw', GetBytesFromBase64(key), algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, decryptionKey, message.slice(16));
        return Common.GetTypedData(decrypted);
    }
}