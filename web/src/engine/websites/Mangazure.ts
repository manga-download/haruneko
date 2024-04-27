import { Tags } from '../Tags';
import icon from './Mangazure.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIitem = {
    title: string,
    url: string;
}

const pageScript = `
    new Promise(resolve =>   {

        function getImageUrl(path) {
            let result = '';
            if (path.includes('&')) {
                const y = path.slice(1).split('&');
                result = $ImgHost;
                result += y[0] + '/' + y[1] + '/' + y[2] + '/' + y[3] + '/s0/' + y[4] + '.jpg';
            } else {
                if (path.includes('@')) {
                    result = path.replace('@', '');
                    result = $ImgHost + result + '=s0';
                } else {
                    if (path.includes('#')) {
                        result = path.replace('#', '');
                        result = $ImgHost + 'drive-viewer/' + result + '=s0';
                    } else {
                        path[0] == '$'
                            ? (result = path.replace('$', ''), result = $ImgHost + 'd/' + result + '=s0')
                            : result = $ImgHost + path + '=s0';
                    }
                }
            }
            return result;
        }

        const rawdata = document.body.innerHTML.match(/\\$chapterContent\\s*=\\s*"([^"]+)/)[1].replace(/<.*>/, '').split('|');
        resolve( rawdata
            .filter(page => page != '')
            .map(page => getImageUrl(page)));
    });
`;

@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://fetch.mangazure.com';

    public constructor() {
        super('mangazure', 'Mangazure', 'https://www.mangazure.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https:\/\/www\.mangazure\.com\/\d{4}\/\d+\/[^/]+.html$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = await FetchWindowScript<string>(new Request(url), '$bookTitle', 500);
        return new Manga(this, provider, this.ConvertToSlug(title), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const categories = ['Tamam', 'Devam', 'Tümü'];
        const perPage = 50;
        const mangaList : Manga[] = [];

        for (const category of categories) {
            for (let offset = 1, run = true; run; offset += perPage) {
                const url = new URL(`/category?q=${category}&start=${offset}&max=${perPage}`, this.apiUrl);
                const request = new Request(url, {
                    headers: {
                        Referer: this.URI.origin,
                        Origin: this.URI.origin
                    }
                });
                const results = await FetchJSON<APIitem[]>(request);
                results.forEach(manga => mangaList.push(new Manga(this, provider, this.ConvertToSlug(manga.title), this.CleanMangaTitle(manga.title))));
                run = results.length > 0;
            }
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/book?q=${manga.Identifier}`, this.apiUrl);
        const request = new Request(url, {
            headers: {
                Referer: this.URI.origin,
                Origin: this.URI.origin
            }
        });
        const chapters = await FetchJSON<APIitem[]>(request);
        return chapters.map(chapter => new Chapter(this, manga, new URL(chapter.url).pathname, chapter.title.replace(manga.Title + ' -', '').trim()));
    }

    private CleanMangaTitle(title: string): string {
        return title.replace('- TANITIM', '').trim();
    }

    private ConvertToSlug(title: string): string {
        return this.CleanMangaTitle(title).trim().toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
}