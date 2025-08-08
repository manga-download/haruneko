import { Tags } from '../Tags';
import icon from './MadaraDex.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/title\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Read "])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madaradex', 'MadaraDex', 'https://madaradex.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchCSS<HTMLImageElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.page-break img');
        return data.map(element => {
            const url = new URL(element.dataset?.src || element.dataset?.lazySrc || element.srcset || element.getAttribute('src'));
            const referer = url.searchParams.get('domain') ? new URL(url.searchParams.get('domain')).href: this.URI.href;
            return new Page(this, chapter, this.DeProxify(url), { Referer: referer });
        });
    }

    private DeProxify(link: URL): URL {
        if (/cdn\.madaradex\.org\/proxy/.test(link.href)) {//they have proxy, proxy_v1, probably more
            return new URL(link.searchParams.get('url') || '');
        }
        return link;
    }
}