import { Tags } from '../Tags';
import icon from './BarManga.webp';
import { FetchWindowPreloadScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2('span.chapter-link-inner', element => ({ id: new URL(element.dataset.href).pathname, title: element.textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('barmanga', 'BarManga', 'https://libribar.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowPreloadScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), () => {
            URL.createObjectURL = obj => obj.toString();
            XMLHttpRequest.prototype.open = function (_: string, url: string) {
                Object.defineProperty(this, 'status', { value: 200 });
                Object.defineProperty(this, 'response', { value: url });
                this.onload();
            };
        }, () => [...document.querySelectorAll<HTMLImageElement>('.reading-content .page-break img[id^="preload-"]')].map(({ src }) => src), 2500);
        return data.map(link => new Page(this, chapter, new URL(link)));
    }
}