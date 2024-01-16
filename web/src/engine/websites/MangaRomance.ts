import { Tags } from '../Tags';
import icon from './MangaRomance.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type FeedResults = {
    feed: {
        entry: {
            link: {
                rel: string,
                href: string,
                title: string
            }[],
        }[]
    }
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.split('/').pop(),
        title: anchor.text.trim()
    };
}

@Common.MangasSinglePageCSS('', 'div.sidebar div#Label1 div.list-label-widget-content ul li a', MangaInfoExtractor)
@Common.PagesSinglePageCSS('article div.entry-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaromance', `Manga Romance`, 'https://www.mangaromance.eu', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/search/label/[^?]+$`).test(this.stripSearch(url));
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const data = await FetchCSS(new Request(this.stripSearch(url)), 'div.sidebar ul li span[dir="ltr"]');
        return new Manga(this, provider, id, data[0].textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/feeds/posts/default/-/${manga.Identifier}?alt=json&max-results=9999`, this.URI).href);
        const { feed } = await FetchJSON<FeedResults>(request);
        return feed.entry.map(entry => {
            const goodLink = entry.link.find(a => a.rel === 'alternate');
            const title = goodLink.title.replace(manga.Title, '').replaceAll(/\[[^\]]+\]/g, '').trim();
            return new Chapter(this, manga, new URL(goodLink.href).pathname, title);
        });
    }

    private stripSearch(url: string): string {
        const uri = new URL(url);
        uri.search = '';
        return uri.href;
    }
}