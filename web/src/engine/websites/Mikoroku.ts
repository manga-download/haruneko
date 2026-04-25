import { Tags } from '../Tags';
import icon from './Mikoroku.webp';
import { type MangaPlugin, Chapter, Manga, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { PageLinkExtractor, ZeistManga, type FeedResults } from './templates/ZeistManga';

type ChapterID = {
    url: string;
    slug: string;
}
export default class extends ZeistManga {

    public constructor() {
        super('mikoroku', 'Mikoroku', 'https://mikoroku.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/detail\\?slug=`).test(url);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { feed: { entry } } = await FetchJSON<FeedResults>(new Request(new URL(`https://www.mikoroku.top/feeds/posts/default?alt=json&max-results=9999`)));
        return entry
            .filter(({ category }) => category && category.some(({ term }) => ["Manga", "Manhua", "Manhwa"].includes(term)))
            .map(({ link, title: { $t } }) => {
                const goodLink = link.find(link => link.rel === 'alternate').href;
                return new Manga(this, provider, goodLink.split('/').at(-1).replace('.html', '').trim(), $t.trim());
            });
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchWindowScript<{ id: string, title: string }>(new Request(new URL(url)), `
            new Promise ( resolve => {
                resolve ({
                    id: new URL(location).searchParams.get('slug'),
                    title : document.querySelector('h1#detailTitle').textContent.trim()
                })
            });
        `, 1500);
        return new Manga(this, provider, id, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return (await this.FetchChapterEntries(manga.Identifier))
            .map(entry => {
                const url = new URL(entry.link.find(l => l.rel === "alternate").href);
                const title = entry.title.$t.replace(manga.Title, '').trim();
                const data = {
                    url: url.href,
                    slug: url.pathname.split('/').at(-1).replace('.html', '')
                };
                return new Chapter(this, manga, JSON.stringify(data), title);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { slug, url }: ChapterID = JSON.parse(chapter.Identifier);
        const allChapters = await this.FetchChapterEntries(chapter.Parent.Identifier);

        let currentIndex = allChapters.findIndex(entry => {
            const slugEntry = entry.title.$t
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-");
            return slugEntry === slug;
        });

        if (currentIndex === -1 && url) {
            currentIndex = allChapters.findIndex(entry =>
                entry.link.some(l => l.href === url)
            );
        }

        const chapterContent = new DOMParser().parseFromString(allChapters[currentIndex].content.$t, 'text/html');
        return [...chapterContent.querySelectorAll('img')].map(image => new Page(this, chapter, new URL(PageLinkExtractor(image))));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const { url }: ChapterID = JSON.parse(chapter.Identifier);
        return new URL(url);
    }

    private async FetchChapterEntries(mangaSlug: string): Promise<FeedResults['feed']['entry']> {
        const { feed } = await FetchJSON<FeedResults>(new Request(new URL(`https://www.mikodrive.my.id/feeds/posts/default?alt=json&max-results=9999&q=${mangaSlug}`)));
        return feed.entry
            .filter(entry => {
                const title = entry.title.$t.toLowerCase();
                return (
                    title.includes("chapter") ||
                    title.match(/chapter\s*\d+/) ||
                    title.match(/\d+/)
                );
            });
    }

}