import { Tags } from '../Tags';
import icon from './SundayWebry.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIChapters = {
    html: string,
    nextUrl: string;
}

type extractChaptersResult = {
    chapters: Chapter[],
    nextUrl: string,
}

const chapterScript = `
    new Promise((resolve, reject) => {
        const listNode = document.querySelector('.js-readable-product-list');
        const morebtn = document.querySelector('button[data-read-more-endpoint]');
        resolve([ listNode.dataset.firstListEndpoint, morebtn.dataset.readMoreEndpoint, listNode.dataset.latestListEndpoint ])
    });
`;

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series', '/series/oneshot', '/series/yoru-sunday'], 'ul.webry-series-list > li.webry-series-item > a')
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sundaywebry', `サンデーうぇぶり (Sunday Webry)`, 'https://www.sunday-webry.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters : Chapter[] = [];
        let request = new Request(new URL(manga.Identifier, this.URI).href);
        //endpoint links have parameters that must not exceed max chapter of the manga, we cant guess the numbers so we just fetch them
        const endPointlinks = await FetchWindowScript<string[]>(request, chapterScript);
        //0 : first chapters url
        //1 : more chapters url (loop)
        //2 : last chapters url

        //fetch first chapters
        request = new Request(endPointlinks[0]);
        let result = await this.extractChapters(manga, request);
        chapters.push(...result.chapters);

        //fetch MORE (paginated)
        request = new Request(endPointlinks[1]);
        let run = true;
        while (run) {
            result = await this.extractChapters(manga, request);
            result.chapters.length > 0 ? chapters.push(...result.chapters): run = false;
            request = new Request(result.nextUrl);
        }
        //fetch last chapters
        request = new Request(endPointlinks[2]);
        result = await this.extractChapters(manga, request);
        chapters.push(...result.chapters);
        return chapters;
    }

    async extractChapters(manga: Manga, request: Request): Promise<extractChaptersResult> {
        try {
            const data = await FetchJSON<APIChapters>(request);
            const dom = new DOMParser().parseFromString(data.html, 'text/html');
            const nodes = [...dom.querySelectorAll<HTMLAnchorElement>('ul li.episode a.series-episode-list-container')];
            const chapters: Chapter[] = nodes.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.querySelector('h4.series-episode-list-title').textContent.trim()));
            return {
                chapters: chapters.reverse(), nextUrl: data.nextUrl
            };
        } catch (error) {
            return { chapters: [], nextUrl: '' };
        }

    }
}