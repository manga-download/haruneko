import { Tags } from '../Tags';
import icon from './MonochromeScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from './../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest } from './../FetchProvider';

type APIManga = { title: string, id: string };
type APIChapter = { name: string, volume: number, number: number, id: string, mangaId: string, version : number, length : number };
const apiUrl = 'https://api.manga.d34d.one';

@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('monochromescans', `Monochrome Scans`, 'https://manga.d34d.one', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https?:\/\/manga\.d34d\.one\/manga\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga>{
        const id = url.split('/').pop();
        const request = new FetchRequest(new URL('/manga/'+ id, apiUrl).href);
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, data.id, data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;

    }

    private async getMangasFromPage(page: number, provider: MangaPlugin) {
        const uri = new URL('/manga', apiUrl);
        uri.searchParams.set('limit', '50');
        uri.searchParams.set('offset', String(page - 1 * 50));
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(entry => new Manga(this, provider, entry.id, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL('/manga/'+manga.Identifier + '/chapters', apiUrl).href);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => {
            let title = '';
            if (chapter.volume) {
                title += `Volume ${chapter.volume} `;
            }
            title += `Chapter ${chapter.number}`;
            if (chapter.name != '') {
                title += ` - ${chapter.name}`;
            }
            return new Chapter(this, manga, chapter.id, title);

        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL('/chapter/' + chapter.Identifier, apiUrl).href);
        const data = await FetchJSON<APIChapter>(request);
        const images = Array.from({ length: data.length }, (_, i) => i + 1).map(index => `${apiUrl}/media/${data.mangaId}/${chapter.Identifier}/${index}.jpg?version=${data.version}`);
        return images.map(page => new Page(this, chapter, new URL(page)));

    }
}