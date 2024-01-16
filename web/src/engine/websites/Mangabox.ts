import { Tags } from '../Tags';
import icon from './Mangabox.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APiMangas = {
    manga: {
        title: string,
        id: number
    }
}

@Common.PagesSinglePageCSS('ul.slides li img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabox', 'Mangabox', 'https://www.mangabox.me', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/reader/\\d+/episodes/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.match(/\/reader\/(\d+)/)[1];
        const request = new Request(url);
        const data = await FetchCSS(request, 'h1.episodes_title');
        return new Manga(this, provider, id, data[0].textContent.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/api/reader/episodes?page=${page}`, this.URI).href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await FetchJSON<APiMangas[]>(request);
        return data.map(manga => new Manga(this, provider, manga.manga.id.toString(), manga.manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/reader/${manga.Identifier}/episodes/`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.episodes_list li.episodes_item a');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('span.episodes_strong_text').textContent.trim()));
    }

}
