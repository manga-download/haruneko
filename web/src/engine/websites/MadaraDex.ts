import { Tags } from '../Tags';
import icon from './MadaraDex.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import { Fetch, FetchRequest } from '../FetchProvider';
import type { Priority } from '../taskpool/TaskPool';

@Madara.MangaCSS(/^{origin}\/title\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Read "])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madaradex', 'MadaraDex', 'https://madaradex.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal,
                headers: {
                    Referer: this.URI.href,
                    "User-Agent": 'Mozilla/5.0 (iPod; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.163 Mobile/15E148 Safari/604.1'
                }
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);

    }
}