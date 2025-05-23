import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';

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

export function PageLinkExtractor(image: HTMLImageElement): string {
    return image.src.replace(/(\/s(\d+[^/]*)(\/[^/]+$))/, '/s0$3');
}

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'header h1[itemprop="name"]')
@Common.PagesSinglePageCSS('article#reader div.separator a img', PageLinkExtractor)
@Common.ImageAjax()
export class ZeistManga extends DecoratableMangaScraper {
    protected mangaSlugScript = `clwd.settings.cat;`;

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL('/feeds/posts/default/-/Series?orderby=published&alt=json&max-results=9999', this.URI)));
        return entry.map(manga => {
            const goodLink = manga.link.find(link => link.rel === 'alternate');
            return new Manga(this, provider, new URL(goodLink.href).pathname, goodLink.title.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaSlug = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), this.mangaSlugScript, 1000);
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL(`/feeds/posts/default/-/${mangaSlug}?start-index=1&orderby=published&alt=json&max-results=9999`, this.URI)));
        return entry.map(chapter => {
            const goodLink = chapter.link.find(link => link.rel === 'alternate');
            return new Chapter(this, manga, new URL(goodLink.href).pathname, goodLink.title.replace(manga.Title, '').trim());
        }).filter(entry => entry.Identifier != manga.Identifier);
    }
}