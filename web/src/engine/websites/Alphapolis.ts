import { Tags } from '../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.title').textContent.replace('[R18]', '').trim();
    return { id, title };
}

function ChaptersExtractor(element: HTMLDivElement) {
    const id = element.querySelector<HTMLAnchorElement>('a.read-episode').pathname;
    const title = element.querySelector<HTMLDivElement>('div.title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/official\/\d+/, 'div.manga-detail-description > div.title')
@Common.MangasMultiPageCSS(`/manga/official/search?page={page}`, 'div.official-manga-panel > a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.episode-unit', ChaptersExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphapolis', `ALPHAPOLIS (アルファポリス)`, 'https://www.alphapolis.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'viewer-manga-horizontal');
        try {
            const pages = JSON.parse(data[0].getAttribute('v-bind:pages'));
            return pages.filter(element => typeof element != 'object' && !element.match('white_page')).map(element => new Page(this, chapter, new URL(element.replace(/\/[0-9]+x[0-9]+.([\w]+)/, '/1080x1536.$1')), {fallbackURL: element}));
        } catch (error) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
    }

    //Since high resolution is not always available, use the real picture url instead of the forces one in case of failure
    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        let blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!blob.type.startsWith('image')) {
            const fakepage = new Page(this, page.Parent as Chapter, new URL(page.Parameters.fallbackURL as string));
            blob = await Common.FetchImageAjax.call(this, fakepage, priority, signal);
        }
        return blob;
    }
}