import { type Tag, Tags } from '../Tags';
import icon from './MangaLife.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    i: string,
    s: string,
}

const queryMangaTitle = 'head title';

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

function ElementLabelExtractor(element: HTMLElement) {
    return element.textContent.split('|')[0].trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, queryMangaTitle, ElementLabelExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly searchPath = '/_search.php';
    public constructor(public readonly Identifier: string = 'mangalife', public readonly Title: string = 'MangaLife', url: string = 'https://manga4life.com', tags: Tag[] = [Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator]) {
        super(Identifier, Title, url, ...tags);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('FullPage', 'yes')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL(this.searchPath, this.URI);
        const request = new Request(url.href, { method: 'POST' });
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(manga => new Manga(this, provider, `/manga/${manga.i}`, manga.s.trim()));
    }

}