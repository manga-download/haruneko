import { Tags } from '../Tags';
import icon from './MechaComic.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { FromHexString } from '../BufferEncoder';

type ContentData = {
    images: Record<string, ImageData[]>;
}

type ImageData = {
    src: string,
    format : string
}

type CryptoKey = {
    cryptoKey : string
}

@Common.MangaCSS(/^{origin}\/books\/\d+$/, 'div.p-bookInfo_title h1')
@Common.MangasMultiPageCSS('/free/list?page={page}', 'div.p-book_detail dt.p-book_title a')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mechacomic', 'MechaComic', 'https://mechacomic.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList : Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const data = await FetchCSS(new Request(new URL(`${manga.Identifier}?page=${page}`, this.URI)), 'li.p-chapterList_item div.p-chapterInfo-comic');
        return data.map(chapter => {
            const title = [
                Common.ElementLabelExtractor('span').call(this, chapter.querySelector('.p-chapterList_no')).trim(),
                chapter.querySelector('.p-chapterList_name').textContent.trim()]
                .join(' ').trim();
            const link = chapter.querySelector<HTMLAnchorElement>('a');
            return new Chapter(this, manga, link.pathname, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const response = await Fetch(new Request(chapterUrl));
        const url = response.redirected ? new URL(response.url) : chapterUrl;

        const rasterScriptURL = url.searchParams.get('contents');
        const verticalScriptURL = url.searchParams.get('contents_vertical');
        const pageScriptURL = url.searchParams.get('contents_page');
        const cryptokeyURL = url.searchParams.get('cryptokey');
        const baseUrl = url.searchParams.get('directory');
        const ver = url.searchParams.get('ver');

        const cryptoKey = cryptokeyURL ? await (await Fetch(new Request(new URL(cryptokeyURL, this.URI)))).text() : '';

        const contentUrl = new URL(rasterScriptURL || verticalScriptURL || pageScriptURL, chapterUrl);
        contentUrl.searchParams.set('ver', ver);
        const { images } = await FetchJSON<ContentData>(new Request(contentUrl));
        return Object.values(images).map(page => {
            const url = new URL(page.shift().src, baseUrl);
            url.searchParams.set('ver', ver);
            return new Page<CryptoKey>(this, chapter, url, { cryptoKey });
        });
    }

    public override async FetchImage(page: Page<CryptoKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const cryptoKey = page.Parameters.cryptoKey;
        return cryptoKey ? await DecryptImage(blob, cryptoKey) : blob;
    }
}

async function DecryptImage(blob: Blob, cryptoKey: string): Promise<Blob> {
    const data = new Uint8Array(await blob.arrayBuffer());
    const cipherText = data.slice(16);
    const iv = data.slice(0, 16);
    const aesKey = await crypto.subtle.importKey('raw', FromHexString(cryptoKey), 'AES-CBC', false, ['decrypt']);
    const decrypted = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv: iv
    }, aesKey, cipherText);

    return Common.GetTypedData(decrypted);
}