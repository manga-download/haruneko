import { Tags } from '../../Tags';
import icon from './MangaSee.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import { FetchCSS, FetchJSON, FetchRequest, FetchWindowScript } from '../../FetchProvider';
import * as Common from '../decorators/Common';

const chapterScript = `
    new Promise((resolve, reject) => {
        try {
            let vm = angular.element($('[ng-app="MainApp"]')).scope().vm;
            let chapters = vm.Chapters.map(chapter => {
            return {
                id: '/read-online/' + vm.IndexName + vm.ChapterURLEncode(chapter.Chapter).replace(/-page-\\d+/, ''),
                title: (chapter.Type || 'Chapter') + ' ' + vm.ChapterDisplay(chapter.Chapter)
            }
        });
        resolve(chapters);
        } catch(error) {
            reject(error);
        }
    });
`;

const pageScript = `
    new Promise((resolve, reject) => {
        try {
            resolve([...document.querySelectorAll('div.ImageGallery div[ng-repeat] img')].map(img => img.src));
        } catch (error) {
            reject(error);
        }
    });
`;

type APIManga = {
    i: string,
    s: string,
}

type APIChapter = {
    id: string,
    title: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasee', `MangaSee`, 'https://mangasee123.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('FullPage', 'yes')`);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.split('/').pop();
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLHeadElement>(request, 'head title');
        const title = data[0].textContent.split('|')[0].trim();
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/_search.php', this.URI);
        const request = new FetchRequest(url.href, { method: 'POST' });
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(manga => new Manga(this, provider, manga.i, manga.s.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL('/manga/' + manga.Identifier, this.URI).href);
        const data = await FetchWindowScript<APIChapter[]>(request, chapterScript, 2500);
        return data.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchWindowScript<string[]>(request, pageScript, 2500);
        return data.map(page => new Page(this, chapter, new URL(page)));
    }
}
