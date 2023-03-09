import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

@Common.MangaCSS(/^https?:\/\/www\.mangatown\.com\/manga\//, 'div.article_content h1.title-top')
@Common.MangasMultiPageCSS('/directory/0-0-0-0-0-0/{page}.htm', 'ul.manga_pic_list li p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter_list li a')
@Common.PagesSinglePageCSS('div.manga_read_footer div.page_select select option', (option: HTMLOptionElement) => option.value)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatown', `MangaTown`, 'https://www.mangatown.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const request = new FetchRequest(page.Link.href);
        const images = await FetchCSS<HTMLImageElement>(request, 'img#image');

        return this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(new URL(images.pop().src, this.URI).href, {
                signal: signal,
                headers: {
                    Referer: 'mangahere.com'
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}