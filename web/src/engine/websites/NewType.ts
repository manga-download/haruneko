import { Tags } from '../Tags';
import icon from './NewType.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    html: string,
    next: number,
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector<HTMLLIElement>('li.detail__txt--ttl').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/contents\/[^/]+\/$/, 'div.section_item--contents ul li h1.contents__ttl')
@Common.MangasSinglePageCSS('/contents/?refind_search=all', 'li.detail__col-list--common > a', MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('newtype', `NewType`, 'https://comic.webnewtype.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const result: Chapter[] = [];
        const request = new Request(new URL(`${manga.Identifier}/more/${page}/`, this.URI).href);
        const data = await FetchJSON<APIChapter>(request);
        const dom = new DOMParser().parseFromString(data.html, 'text/html');
        const nodes = dom.querySelectorAll('li a h2.detail__txt--ttl-sub');
        nodes.forEach(chapter => {
            const id = chapter.closest<HTMLAnchorElement>('a').pathname;
            const title = chapter.textContent.replace(manga.Title, '').trim();
            result.push(new Chapter(this, manga, id, title));
        });
        return result;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'div#viewerContainer');
        const link = new URL(data[0].dataset.url, request.url);
        const datta = await FetchJSON<string[]>(new Request(link.href));
        return datta.map(image => {
            if (Array.isArray(image))
                image = image.filter(url => url.startsWith('/'))[0];
            image = image.replace(/\/h1200[\S]+/, '');
            return new Page(this, chapter, new URL(image, request.url));
        });
    }
}