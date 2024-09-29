import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

function ImageScript(pageIndex: number): string {
    return `
        new Promise(async (resolve, reject) => {
            try {
                const response = await fetch('chapterfun.ashx?cid='+ window.chapter_id + '&page=' + ${pageIndex});
                eval(await response.text());
                resolve(new URL(d[0], window.location.origin).href);
            } catch(error) {
                reject(error);
            }
        });
    `;
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.article_content h1.title-top')
@Common.MangasMultiPageCSS('/directory/0-0-0-0-0-0/{page}.htm', 'ul.manga_pic_list li p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter_list li a')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatown', `MangaTown`, 'https://www.mangatown.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const pageCount = await FetchWindowScript<number>(new Request(chapterUrl), 'window.total_pages');
        return new Array(pageCount).fill(0).map((_, index) => new Page(this, chapter, chapterUrl, { pageIndex: index + 1, Referer: 'https://mangahere.com' }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const uri = await FetchWindowScript<string>(new Request(page.Link, { signal }), ImageScript(page.Parameters.pageIndex as number));
            const request = new Request(uri, {
                signal,
                headers: {
                    Referer: page.Parameters.Referer
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}