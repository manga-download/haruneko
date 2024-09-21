import { Tags } from '../Tags';
import icon from './RuManhua.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIResponse<T> = {
    data : T | string
}

type APIManga = {
    id: string,
    bookName: string
}

type APIChapter = {
    chapterid: string,
    chaptername: string
}

const pagesScript = `[... document.querySelectorAll('div.chapter-img-box img')].map(image=> image.dataset.src || image.src);`;

@Common.PagesSinglePageJS(pagesScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rumanhua', 'RuManhua', 'https://rumanhua.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS(new Request(url), 'div.book-name h1.name')).shift().textContent.trim();
        const id = url.split('/').at(-2);
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIResponse<APIManga[]>>(new Request(new URL('/data/sort', this.URI), {
            method: 'POST',
            body: `s=1&p=${page}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-Requested-With': 'XMLHttpRequest'
            }
        }));
        return data instanceof Array ? (data as APIManga[]).map(item => new Manga(this, provider, item.id, item.bookName)): [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.chaplist-box ul li a');
        const { data } = await FetchJSON<APIResponse<APIChapter[]>>(new Request(new URL('/morechapter', this.URI), {
            method: 'POST',
            body: `id=${manga.Identifier}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'X-Requested-With': 'XMLHttpRequest'
            }
        }));

        if (data instanceof Array) {
            chapterList.push(...data.map(chapter => new Chapter(this, manga, `/${manga.Identifier}/${chapter.chapterid}.html`, chapter.chaptername)));
        }
        return chapterList;
    }

}