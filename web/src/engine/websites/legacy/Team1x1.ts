import { Tags } from '../../Tags';
import icon from './Team1x1.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

//THIS WEBSITE OFTEN CHANGE URL : THIS HAS TO BE IMPLEMENTED
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.tt').textContent.trim();
    return {id, title };
}

@Common.MangasMultiPageCSS('/series?page={page}', 'div.bs div.bsx a', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageCSS('.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('team1x1', `Team X`, 'https://team1x1.fun', Tags.Language.Arabic, Tags.Media.Manhua, Tags.Media.Manhwa);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname;
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLHeadingElement>(request, 'div.author-info-title > h1');
        return new Manga(this, provider, id, data[0].textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this._getChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }
    private async _getChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]>{
        const uri = new URL(`${manga.Identifier}?page=${page}`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.eplister ul li a:not([data-bs-toggle])');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('.epl-title').textContent.trim()));
    }
}

// Original Source
/*
class Team1x1 extends Connector {

    constructor() {
        super();
        super.id = 'team1x1';
        super.label = 'Team X';
        this.tags = ['webtoon', 'arabic'];

        this.config = {
            url: {
                label: 'URL',
                description: 'This website changes their URL regularly.\nThis is the last known URL which can also be manually set by the user.',
                input: 'text',
                value: 'https://teamx.fun'
            }
        };
    }

    get url() {
        return this.config.url.value;
    }

    set url(value) {
        if (this.config && value) {
            this.config.url.value = value;
            Engine.Settings.save();
        }
    }

    canHandleURI(uri) {
        return /team1x\d*\.com|tqneplus\.com/.test(uri.hostname);
    }

    async _initializeConnector() {
        let uri = new URL(this.url);
        let request = new Request(uri.href, this.requestOptions);
        this.url = await Engine.Request.fetchUI(request, `window.location.origin`);
        console.log(`Assigned URL '${this.url}' to ${this.label}`);
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'div.row > div.col-md-9 > h3');
        const id = uri.pathname + uri.search;
        const title = data[0].textContent;
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL(`/manga/page/${page}/`, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, 'div#page-manga div.container div.last-post-manga div.thumb div.info h3 a');
        return data.map(element => {
            return {
                id: element.pathname,
                title: element.text.trim()
            };
        });
    }

    async _getChapters(manga) {
        let chapterList = [];
        const request = new Request(this.url + manga.id, this.requestOptions);
        const data = await this.fetchDOM(request, 'div.pagination span.current');
        const pageCount = parseInt(data[0].textContent.trim());
        for (let page = 1; page <= pageCount; page++) {
            let chapters = await this._getChaptersFromPage(page, manga);
            chapterList.push(...chapters);
        }
        return chapterList;
    }

    async _getChaptersFromPage(page, manga) {
        const request = new Request(this.url + manga.id + '/page/' + page, this.requestOptions);
        const data = await this.fetchDOM(request, 'div.single-manga-chapter div.container div.row div.col-md-12 a');
        return data
            .filter(element => element.href.startsWith(this.url))
            .map(element => {
                return {
                    id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                    title: element.text.replace(manga.title, '').trim(),
                    language: ''
                };
            }).reverse();
    }

    async _getPages(chapter) {
        let request = new Request(this.url + chapter.id, this.requestOptions);
        let data = await this.fetchDOM(request, 'div[id^="translationPageall"] embed');
        return data.map(dat => dat.src);
    }
}
*/