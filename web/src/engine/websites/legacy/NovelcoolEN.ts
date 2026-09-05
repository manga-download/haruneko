import { Tags } from '../../Tags';
import icon from './NovelcoolEN.webp';
import { Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { Fetch, FetchHTML, FetchRegex, FetchWindowScript } from '../../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/novel\/[^/]+\.html/, 'h1.bookinfo-title', (element, uri) => ({ id: uri.pathname, title: element.textContent }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.chapter-item-list div.chp-item a', undefined, anchor => ({
    id: anchor.href,
    title: anchor.title.trim()
}))
@Common.PagesSinglePageJS('NiaddChpPageCtrl.options.all_imgs_url;', 2500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelcool-en', `Novel Cool (EN)`, 'https://www.novelcool.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
    /*
    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const pages = await FetchWindowScript<string[]>(this.CreateRequest(chapterUrl), 'NiaddChpPageCtrl.options.all_imgs_url;', 2500);
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: chapterUrl.href }));
    }*/

    private CreateRequest(url: URL, signal: AbortSignal = undefined): Request {
        return new Request(url, {
            signal,
            headers: {
                'Referer': undefined //no referer is mandatory to bypass website protection
            }
        });
    }

}

// Original Source
/*
class NovelcoolEN extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-en';
        super.label = 'Novel Cool (EN)';
        this.tags = [ 'english', 'manga', 'webtoon'];
        this.url = 'https://www.novelcool.com';
        this.links = {
            login: 'https://novelcool.com/login.html'
        };
    }
}
*/