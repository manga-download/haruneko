import { Tags } from '../Tags';
import icon from './Tsumino.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIMangas = {
    pageNumber: number,
    pageCount: number,
    data: APIMangaEntry[]
}

type APIMangaEntry = {
    entry: {
        id: number,
        title: string,
        duration: number;
    }
}

@Common.MangaCSS(/^{origin}\/entry\/\d+$/, 'head meta[property="og:title"]')
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tsumino', `Tsumino`, 'https://www.tsumino.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async getMangasFromPage(provider: MangaPlugin, page: number): Promise<Manga[]> {
        const uri = new URL('/Search/Operate/', this.URI);
        const params = new URLSearchParams({
            type: 'Book',
            PageNumber: String(page),
            Text: '',
            Sort: 'Alphabetical',
            List: '0',
            Length: '0',
            MinimumRating: '0',
            ExcludeList: '0',
            CompletelyExcludeHated: 'false'
        });

        uri.search = params.toString();
        const request = new Request(uri.href, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        try {
            const { data } = await FetchJSON<APIMangas>(request);
            return data.map(manga => new Manga(this, provider, `/entry/${manga.entry.id}`, manga.entry.title.trim()));
        } catch {
        //
        }
        return [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let script = `
                new Promise(resolve => {
                    let link = document.querySelector('div.book-line div.book-data a#btnReadOnline');
                    resolve(link.href);
                });
            `;
        const referer = new Request(new URL(chapter.Identifier, this.URI).href);
        const link = await FetchWindowScript<string>(referer, script);
        script = `
                new Promise(async (resolve, reject) => {
                    try {
                        let element = document.querySelector('div#image-container');
                        let chapterID = parseInt(element.dataset.opt);
                        let templateURL = element.dataset.cdn ? new URL(decodeURI(element.dataset.cdn), window.location).href : undefined;
                        let baseURI = element.dataset.obj ? new URL(decodeURI(element.dataset.obj), window.location) : undefined;
                        let loaderURI = element.dataset.url ? new URL(decodeURI(element.dataset.url), window.location) : undefined;
                        loaderURI.searchParams.set('q', chapterID);
                        let pageList = [];
                        let response = await fetch(loaderURI);
                        let data = await response.json();
                        for (let index = 0; index < data.reader_page_total; index++) {
                            if(templateURL) {
                                pageList.push(templateURL.replace('[PAGE]', index + 1));
                            } else {
                                baseURI.set('name', data.reader_page_urls[index]);
                                pageList.push(baseURI.href);
                            }
                        }
                        resolve(pageList);
                    } catch(error) {
                        reject(error);
                    }
                });
            `;
        const request = new Request(link);
        const pages = await FetchWindowScript<string[]>(request, script, 500);
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: referer.url }));

    }
}