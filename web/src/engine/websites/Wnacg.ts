import { Tags } from '../Tags';
import icon from './Wnacg.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchHTML, FetchRegex } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

@Common.MangaCSS(/^{origin}\/photos-index/, 'div#bodywrap > h2')
@Common.MangasMultiPageCSS('ul li.gallary_item div.info div.title a', Common.PatternLinkGenerator('/albums-index-page-{page}.html'))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wnacg', `Wnacg`, 'https://www.wnacg.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const doc = await FetchHTML(new Request(new URL(`${manga.Identifier}?order=desc`, this.URI)));
        const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('div.sr_compact a.tagshow')].map(anchor => new Chapter(this, manga, anchor.pathname, anchor.textContent.trim()));
        return chapters.length > 0 ? chapters : [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        if (/photos-slide/.test(chapter.Identifier)) {
            const frameId = chapter.Identifier.replace('-slide-', '-item-').replace(/-sid-\d+/, '');
            const images = await FetchRegex(new Request(new URL(frameId, this.URI)), /(https?:\/\/[^\s"']+)/g);
            return images.map(page => new Page(this, chapter, new URL(page.replace('http', 'https'))));
        } else {
            const element = (await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'ul li.gallary_item div.pic_box > a:first-of-type')).at(-1);
            const options = await FetchCSS<HTMLOptionElement>(new Request(new URL(element.pathname, this.URI)), 'div.newpage select.pageselect option');
            return options.map(option => new Page(this, chapter, new URL(`/photos-view-id-${option.value}.html`, this.URI)));
        }
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return page.Link.href.endsWith('.html') ? Common.FetchImageAjaxFromHTML.call(this, page, priority, signal, 'img#picarea')
            : Common.FetchImageAjax.call(this, page, priority, signal);
    }
}