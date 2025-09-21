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
        const chaptersList: Chapter[] = [];
        const mangaSlug = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), this.mangaSlugScript, 1000);
        for (let run = true, index = 1; run;) {
            const chapters = (await this.FetchEntries(mangaSlug, index, manga)).map(entry => new Chapter(this, manga, entry.pathname, entry.title));
            chapters.length > 0 ? chaptersList.push(...chapters) : run = false;
            index += chapters.length;
        }
        return chaptersList.distinct();
    }

    private async FetchEntries(slug: string, index = 1, parent: Manga = undefined): Promise<MediaEntry[]> {
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL(`/feeds/posts/default/-/${slug}?start-index=${index}&alt=json&max-results=9999`, this.URI)));
        return !entry ? [] : entry.map(chapter => {
            const goodLink = chapter.link.find(link => link.rel === 'alternate');
            const title = parent ? goodLink.title.replace(parent.Title, '').replace(slug, '').trim() : goodLink.title.trim();
            return { pathname: new URL(goodLink.href).pathname, title };
        }).filter(entry => parent ? entry.pathname != parent.Identifier : true);
    }
}