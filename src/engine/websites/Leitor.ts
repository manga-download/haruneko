import { MangaScraper, Manga, Chapter, Page, MangaPlugin } from '../providers/MangaPlugin';
import { FetchRequest, FetchCSS, FetchJSON, FetchWindowScript } from '../FetchProvider';
import { FetchMangasMultiPageCSS } from './decorators/Common';

export default class extends MangaScraper {

    public constructor() {
        super('leitor', 'Leitor', 'https://leitor.net');
    }

    /*
    // [ 'manga', 'webtoon', 'portuguese' ]
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public async Initialize(): Promise<void> {
        const paths = [ '/', '/manga/_/_/capitulo-' ];
        for(const path of paths) {
            const uri = new URL(path, this.URI);
            const request = new FetchRequest(uri.href);
            await FetchWindowScript(request, '');
        }
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return FetchMangasMultiPageCSS.call(this, provider, '/series/index/?page={page}', 'ul.seriesList li > a.link-block');
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for(let page = 1, run = true; run; page++) {
            const chapters = await this.FetchChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    public async FetchChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const uri = new URL('/series/chapters_list.json', this.URI);
        const match = manga.Identifier.match(/\/(\d+)\/?$/);
        uri.searchParams.set('id_serie', match ? match[1] : '');
        uri.searchParams.set('page', String(page));
        const request = new FetchRequest(uri.href);
        request.headers.set('X-Requested-With', 'XMLHttpRequest');
        const data = await FetchJSON<any>(request);
        return !data.chapters ? [] : data.chapters.reduce((accumulator: Chapter[], chapter: any) => {
            //const id = chapter.id_chapter;
            const title = chapter.chapter_name ? `${chapter.number} - ${chapter.chapter_name}` : chapter.number;
            const releases = Object.values(chapter.releases).map((release: any) => {
                const scanlators = release.scanlators.map((scanlator: any) => scanlator.name).join(', ');
                return new Chapter(this, manga, release.link, `${title} [${scanlators}]`);
            });
            return accumulator.concat(releases);
        }, []);
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLScriptElement>(request, 'script[src*="token="]');
        const source = new URL(data[0].src);
        const release = source.searchParams.get('id_release') || '';
        const token = source.searchParams.get('token') || '';
        const links = await this.FetchImageLinks(release, token);
        return links.map((link: URL) => new Page(this, chapter, link));
    }

    private async FetchImageLinks(release: string, token: string): Promise<URL[]> {
        const uri = new URL(`/leitor/pages/${release}.json`, this.URI);
        uri.searchParams.set('key', token);
        const request = new FetchRequest(uri.href);
        request.headers.set('X-Requested-With', 'XMLHttpRequest');
        const data = await FetchJSON<any>(request);
        return data.images.map((image: string) => new URL(image));
    }
}