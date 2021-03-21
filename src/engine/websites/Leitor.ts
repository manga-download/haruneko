import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { FetchRequest, FetchCSS } from '../RequestProvider';

export default class extends MangaScraper {

    public readonly Identifier = `leitor`;
    public readonly Title = `Leitor`;
    public readonly URI = new URL('https://leitor.net');
    /*
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for(let page = 1, run = true; run; page++) {
            const mangas = await this.FetchMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async FetchMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const uri = new URL(`/series/index/?page=${page}`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.seriesList li > a.link-block');
        return data.map(element => {
            const id = element.pathname;
            const title = element.title.replace(/(?:^\s*ler\s+|\s+online\s*$)/gi, '').trim();
            return new Manga(this, provider, id, title);
        });
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            new Chapter(this, manga, '/001', 'Chapter 1 - Beginning')
        ];
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const init = {};
        return [
            new Page(this, chapter, this.URI.origin + '/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page01.png', init)
        ];
    }
}