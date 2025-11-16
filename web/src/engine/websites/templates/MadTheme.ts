import { type Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

const pageScript = `window.chapImages.split(',').map(image => window.mainServer ? window.mainServer + image : image);`;
export const queryChapters = 'ul.chapter-list li a';

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.chapter-title').textContent.trim()
    };
}

function ChapterScript(bookVariable: string, chapterEndpoint: string): string {
    return `
        new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('${chapterEndpoint}'.replace('{bookVariable}', ${bookVariable}));
                const data = await response.text();
                const doc = new DOMParser().parseFromString(data, 'text/html');
                resolve ( [...doc.querySelectorAll('${queryChapters}')].map(chapter => {
                    return { id: chapter.pathname, title : chapter.querySelector('.chapter-title').textContent.trim() }
                }));
            } catch(error) {
                reject(error);
            }
        });
    `;
}

@Common.MangaCSS(/^{origin}(\/manga)?\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('div.manga-list div.title h3 a', Common.PatternLinkGenerator('/az-list?page={page}'))
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export class MadTheme extends DecoratableMangaScraper {
    protected bookVariable = 'bookId';
    protected chapterEndpoint = '/api/manga/{bookVariable}/chapters?source=detail'; //some websites have another endpoint but all chapters are already displayed

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return Common.FetchChaptersSinglePageJS.call(this, manga, ChapterScript(this.bookVariable, this.chapterEndpoint), 1500);
    }
}