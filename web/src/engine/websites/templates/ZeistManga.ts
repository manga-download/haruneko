import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';

// TODO: Check for possible revision

type FeedResults = {
    feed: {
        entry: {
            link: {
                rel: string,
                href: string,
                title: string;
            }[],
        }[];
    };
};

type MediaEntry = {
    pathname: string,
    title: string;
};

export function PageLinkExtractor(image: HTMLImageElement): string {
    return image.src.replace(/\/s\d+[^/]*(\/[^/]+$)/, '/s0$1');
}

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'header h1[itemprop="name"]')
@Common.PagesSinglePageCSS('article#reader div.separator a img', PageLinkExtractor)
@Common.ImageAjax()
export class ZeistManga extends DecoratableMangaScraper {

    protected mangaSlugScript = `clwd.settings.cat;`;
    protected mangaEntriesSlug = 'Series';

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return (await this.FetchEntries(this.mangaEntriesSlug)).map(entry => new Manga(this, provider, entry.pathname, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaSlug = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), this.mangaSlugScript, 1000);
        return (await this.FetchEntries(mangaSlug, manga)).map(entry => new Chapter(this, manga, entry.pathname, entry.title));
    }

    private async FetchEntries(slug: string, parent: Manga = undefined): Promise<MediaEntry[]> {
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL(`/feeds/posts/default/-/${slug}?start-index=1&alt=json&max-results=9999`, this.URI)));
        return entry.map(chapter => {
            const goodLink = chapter.link.find(link => link.rel === 'alternate');
            return { pathname: new URL(goodLink.href).pathname, title: goodLink.title.replace(parent?.Title, '').trim() };
        }).filter(entry => parent ? entry.pathname != parent.Identifier : true);
    }
}