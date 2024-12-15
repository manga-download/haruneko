import { Tags } from '../Tags';
import icon from './MangaPlaza.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

type APIChapterResult = {
    data: {
        html_content: string,
        html_page: string
    }
}

@Common.MangaCSS(/^{origin}\/title\/\d+\/$/, 'div.mainTitle h1.titleTxt')
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016130, true)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaplaza', `MangaPlaza`, ' https://mangaplaza.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mp_over18_agreement', 'ON')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        //fetch genre list
        let genres = (await FetchCSS<HTMLAnchorElement>(new Request(new URL('/genre/', this.URI)), 'a[href*="/genre/"]')).filter(link => link.pathname.match(/genre\/\d+\/$/)).map(link => link.pathname.match(/\d+/)[0]);
        genres = Array.from(new Set(genres));
        const mangaList: Manga[] = [];
        for (const genre of genres) {
            mangaList.push(... await Common.FetchMangasMultiPageCSS.call(this, provider, `/genre/${genre}/?page={page}`, 'ul.listBox li div.titleName a'));
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        const mangaid = manga.Identifier.match(/title\/(\d+)/)[1];
        let page = 1;
        let pageMax = 1;

        while (page <= pageMax) {
            const request = new Request(new URL(`/api/title/content_list/?title_id=${mangaid}&content_id=0&page=${page}&order=down&_=${Date.now().toString()}`, this.URI));
            const { data } = await FetchJSON<APIChapterResult>(request);
            const chaptersNodes = [...new DOMParser().parseFromString(data.html_content, 'text/html').querySelectorAll<HTMLElement>('ul.detailBox div.inner_table')];
            for (const chapterNode of chaptersNodes) {
                const title = chapterNode.querySelector('p.titleName').textContent.trim();
                const linkNode = chapterNode.querySelector<HTMLAnchorElement>('div.btnBlock a.prevBtn');
                if (linkNode) chapters.push(new Chapter(this, manga, linkNode.pathname + linkNode.search, title));
            }

            if (page == 1 && data.html_page != '') {
                pageMax = parseInt(new DOMParser().parseFromString(data.html_page, 'text/html').querySelector<HTMLAnchorElement>('ul#_pages li:nth-last-of-type(2) a').dataset.page);
            }
            page++;
        }

        return chapters.distinct();
    }
}