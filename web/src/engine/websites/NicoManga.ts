import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, type Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

type APIMangas = {
    manga_list: {
        name: string,
        slug: string
    }[],
    lang: {
        manga_slug: string
    }
}

type APIChapters = {
    chapter: string,
    name: string,
}[];

@Common.MangaCSS<HTMLHeadingElement>(FlatManga.pathManga, FlatManga.queryMangaTitle, (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/\(MANGA\)$/i, '').trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly pathChapters = '/app/manga/controllers/cont.Listchapter.php?slug={manga}';

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPageAJAX(provider, page);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList.distinct();
    }

    private async GetMangasFromPageAJAX(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const request = new Request(new URL(`/app/manga/controllers/cont.display.homeTopday.php?page=${page}`, this.URI), {
            headers: {
                Referer: new URL('/manga-list.html', this.URI.origin).href,
            }
        });
        const { manga_list, lang: { manga_slug } } = await FetchJSON<APIMangas>(request);
        return manga_list.map(manga => new Manga(this, provider, `/${manga_slug}-${manga.slug}.html`, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = FlatManga.ExtractSlug(manga);
        const uri = new URL(this.pathChapters.replace('{manga}', slug), this.URI);
        const chapters = await FetchJSON<APIChapters>(new Request(uri, { headers: { Referer: new URL(manga.Identifier, this.URI).href } }));
        return chapters.map(chapter => new Chapter(this, manga, `/read-${slug}-chapter-${chapter.chapter}.html`, chapter.name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FlatManga.FetchPagesAJAX.call(
            this,
            chapter,
            /loadImagesChapter\s*\(\s*(\d+)\s*,\s*'listImgs'\s*\)/g,
            '/app/manga/controllers/cont.imgsList.php?cid={chapter}',
            FlatManga.queryPages,
            img => img.dataset.srcset);
    }
}