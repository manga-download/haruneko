import { Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import * as Common from '../decorators/Common';

const pageScript = `
    new Promise(resolve => {
        const mainserver = cdns.shift();
        resolve( [...document.querySelectorAll('div.container-chapter-reader > img')].map ( image  => {
            const imagePath = new URL(image.dataset.src || image.src ).pathname;
            const mirrors = cdns.map(server => new URL(imagePath, server).href);
            return { url : new URL(imagePath, mainserver).href, mirrors };
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ul.manga-info-text li h1')
@Common.MangasMultiPageCSS('/manga-list/latest-manga?page={page}', 'div.truyen-list div.list-truyen-item-wrap h3 a', 1, 1, 500)
    @Common.ChaptersSinglePageCSS('div.chapter-list div.row span a')
export class MangaNel extends DecoratableMangaScraper {

    // TODO: Download Pages with Mirror Links ...
    // => See: Grouple.PagesSinglePageJS(pageScript)
    public override async FetchPages(_chapter: Chapter): Promise<Page[]> {
        return [];
    }

    // TODO: Fetch Images from Mirror Links ...
    // => See: Grouple.ImageAjaxWithMirrors()
    public override async FetchImage(_page: Page, _priority: Priority, _signal: AbortSignal): Promise<Blob> {
        return null;
    }
}