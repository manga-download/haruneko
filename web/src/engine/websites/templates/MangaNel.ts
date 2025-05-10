import { FetchWindowScript } from '../../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
import type { ImagesData, PageMirrored } from '../decorators/Grouple';
import * as Grouple from '../decorators/Grouple';

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
@Grouple.ImageAjaxWithMirrors()
export class MangaNel extends DecoratableMangaScraper {

    public override async FetchPages(chapter: Chapter): Promise<Page<PageMirrored>[]> {
        const data = await FetchWindowScript<ImagesData[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1000);
        return data.map(element => new Page(this, chapter, new URL(element.url), { Referer: this.URI.href, mirrors: element.mirrors }));
    }
}