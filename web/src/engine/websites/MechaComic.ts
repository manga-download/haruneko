import { Tags } from '../Tags';
import icon from './AdonisFansub.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

type ContentData = {
    images: {
        [id: string]: {
            src: string,
            format: string
        }[]
    }
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
        const chapterList = [];
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
            return new Chapter(this, manga, link.pathname + link.search, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        let url = chapterUrl;
        const response = await Fetch(new Request(chapterUrl));
        if (response.redirected) url.href = response.url;

        const rasterScriptURL = url.searchParams.get("contents");
        const verticalScriptURL = url.searchParams.get("contents_vertical");
        const pageScriptURL = url.searchParams.get("contents_page");
        const cryptokeyURL = url.searchParams.get("cryptokey");
        const baseUrl = url.searchParams.get("directory");
        const ver = url.searchParams.get("ver");

        //Fetch key
        const cryptoKey = cryptokeyURL ? await (await Fetch(new Request(new URL(cryptokeyURL, this.URI)))).text() : '';

        //Fetch content.json
        const contentUrl = new URL(rasterScriptURL || verticalScriptURL || pageScriptURL, chapterUrl);
        contentUrl.searchParams.set('ver', ver);
        const { images } = await FetchJSON<ContentData>(new Request(contentUrl));
        return Object.values(images).map(page => {
            const url = new URL(page.shift().src, baseUrl);
            url.searchParams.set('ver', ver);
            return new Page(this, chapter, url, { cryptoKey });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        let data = await this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link));
            return response.arrayBuffer();
        }, priority, signal);

        const cryptoKey = page.Parameters.cryptoKey as string;

        if (cryptoKey) {
            const cipherText = data.slice(16);
            const iv = data.slice(0, 16);

            const aesKey = await crypto.subtle.importKey('raw', Buffer.from(cryptoKey, 'hex'), 'AES-CBC', false, ['decrypt']);
            data = await crypto.subtle.decrypt({
                name: 'AES-CBC',
                iv: iv
            }, aesKey, cipherText);
        }

        return Common.GetTypedData(data);

    }

}
