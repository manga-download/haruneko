import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

// TODO: Check for possible revision

export type FeedResults = {
    feed: {
        entry: {
            link: {
                rel: string;
                href: string;
                title: string;
            }[],
            category: Category[];
            title: {
                $t: string;
            };
            content: {
                $t: string;
            };
        }[]
    };
};

type MediaEntry = {
    pathname: string;
    title: string;
    category: Category[];
};

type Category = {
    term: string;
};

export function PageLinkExtractor(image: HTMLImageElement): string {
    return image.src.replace(/\/s\d+[^/]*(\/[^/]+$)/, '/s0$1');
}

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'header h1[itemprop="name"]')
@Common.ChapterURL()
@Common.PagesSinglePageCSS('article#reader div.separator a img', PageLinkExtractor)
@Common.ImageAjax()
export class ZeistManga extends DecoratableMangaScraper {

    private mangaSlugScript = `clwd.settings.cat;`;
    private mangaEntriesSlug = 'Series';

    protected WithMangaSlugScript(script: string) {
        this.mangaSlugScript = script;
        return this;
    }

    protected WithMangaEntriesSlug(slug: string) {
        this.mangaEntriesSlug = slug;
        return this;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const entries = (await this.FetchEntries(this.mangaEntriesSlug)).filter(({ category }) => {
            const categories = category.map(({ term }) => term.toLowerCase());
            return categories.some(el => el === this.mangaEntriesSlug.toLowerCase());
        });
        return entries.map(({ pathname, title }) => new Manga(this, provider, pathname, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chaptersList: Chapter[] = [];
        const mangaSlug = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), this.mangaSlugScript, 1500);
        for (let run = true, index = 1; run;) {

            const entries = (await this.FetchEntries(mangaSlug, index))
                .filter(({ category }) => {
                    const categories = category.map(({ term }) => term.toLowerCase());
                    return !categories.some(el => el === this.mangaEntriesSlug.toLowerCase());
                });

            const chapters = entries.map(({ pathname, title }) => {
                const cleanedTitle = title.replace(manga.Title, '').replace(decodeURIComponent(mangaSlug), '').replace(/^\s*-\s*/, '').trim() || title.trim();
                return new Chapter(this, manga, pathname, cleanedTitle);
            });
            chapters.length > 0 ? chaptersList.push(...chapters) : run = false;
            index += chapters.length;
        }
        return chaptersList.distinct();
    }

    private async FetchEntries(slug: string, index = 1): Promise<MediaEntry[]> {
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL(`/feeds/posts/default/-/${slug}?start-index=${index}&alt=json&max-results=9999`, this.URI)));
        return !entry ? [] : entry.map(({ link, category }) => {
            const goodLink = link.find(link => link.rel === 'alternate');
            return { pathname: new URL(goodLink.href).pathname, title: goodLink.title.trim(), category };
        });
    }
}