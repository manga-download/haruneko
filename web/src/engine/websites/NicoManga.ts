import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { CleanTitle, FlatManga, ChapterScript, PageScript } from './templates/FlatManga';

type APIMangas = {
    manga_list: {
        name: string,
        slug: string
    }[],
    lang: {
        manga_slug: string
    }
}

@Common.ChaptersSinglePageJS(ChapterScript(), 1500)
@Common.PagesSinglePageJS(PageScript(), 1500)
export default class extends FlatManga {

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
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const { manga_list, lang: { manga_slug } } = await FetchJSON<APIMangas>(request);
        return manga_list.map(manga => new Manga(this, provider, `/${manga_slug}-${manga.slug}.html`, CleanTitle(manga.name.trim())));
    }

}