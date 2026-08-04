import { Tags } from '../Tags';
import icon from './MyMangaList.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, type Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    group: {
        items: {
            id: number;
            label: string;
            href: string;
        }[]
    };
};

@Common.MangaCSS(/^{origin}\/t-[^/]+$/, 'section.page-card h1.page-heading')
@Common.PagesSinglePageJS('MYMANGALIST_READER.pageUrls;', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mymangalist', 'MyMangaList', 'https://www5.mymangalist.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const letter of ['0-9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.results a.cardish', Common.PatternLinkGenerator(`/advanced-search?starts_with=${letter}&content_type=All&sort=popular&page={page}`), 0, (anchor: HTMLAnchorElement) => ({
                id: anchor.pathname,
                title: anchor.querySelector('div.card-copy strong').textContent.trim()
            }));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '#chapterGroups')).at(0).dataset.titlePermalink;
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += 50) {
                const { group: { items } } = await FetchJSON<APIChapters>(new Request(new URL(`./titles/chapters.php?permalink=${slug}&offset=${offset}&limit=50`, this.apiURL)));
                const chapters = (items ?? []).map(({ label, href }) => new Chapter(this, manga, `/${href}`, label));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));;
    }
}