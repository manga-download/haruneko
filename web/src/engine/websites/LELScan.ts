import { Tags } from '../Tags';
import icon from './LELScan.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import DeProxify from '../transformers/ImageLinkDeProxifier';

function ChapterExtractor(option: HTMLOptionElement) {
    const id = new URL(option.value).pathname;
    const title = option.text.trim();
    return { id, title };
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.title.replace(/lecture en ligne/, '').trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/lelscans\.net\/lecture[^/]+$/, 'meta[name="lelscan"]')
@Common.MangasSinglePageCSS('', 'div.outil_lecture ul li a', MangaExtractor)
@Common.ChaptersSinglePageCSS('div#header-image form select:first-of-type option', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscan', `LELScan`, 'https://lelscans.net', Tags.Language.French, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        let data = await FetchCSS<HTMLAnchorElement>(request, 'div#navigation a');
        data = data.filter(element => parseInt(element.text.trim()));
        return data.map(page => new Page(this, chapter, new URL(page.pathname, this.URI)));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const image = await this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal
            });
            const realimage = new URL((await FetchCSS<HTMLImageElement>(request, 'div#image img'))[0].src).pathname;
            return new Page(this, page.Parent as Chapter, new URL(DeProxify(new URL(realimage, page.Link.origin)).href));
        }, priority, signal);

        return await Common.FetchImageAjax.call(this, image, priority, signal, false);
    }

}