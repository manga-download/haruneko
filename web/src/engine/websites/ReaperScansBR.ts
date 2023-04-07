import { Tags } from '../Tags';
import icon from './ReaperScansBR.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest, FetchWindowScript } from './../FetchProvider';

const apiUrl = 'https://api.reaperscans.net';

type JSONNextMangaID = {
    props: {
        pageProps: {
            data : { id : string }
        }
    }
};

type JSONNextManga = {
    props: {
        pageProps: {
            series: {
                chapters: { id: number, chapter_name: string, chapter_slug: string} []
            }
        }
    }
};

type JSONChapters = {
    content: {
        images: string[]
    }
};

type JSONMangas = {
    data: { id: number, title: string, series_slug : string}[]
}

@Common.MangaCSS(/^https?:\/\/reaperscans\.net\/series\/[^/]+$/, 'div.series-title > h1')
@Common.ImageAjax(true)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscansbr', `Reaper Scans (Portuguese)`, 'https://reaperscans.net', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]>{
        const uri = new URL('/series/querysearch', apiUrl);
        const body = {
            order: 'asc',
            order_by: 'latest',
            series_type: 'Comic',
            page: page,
            tagIds: [],
        };
        const request = new FetchRequest(uri.href, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'text/html, application/xhtml+xml',
                'Content-Type': 'application/json',
                'Referer': this.URI.href,
            }
        });

        const data = await FetchJSON<JSONMangas>(request);
        return data.data.map(manga => new Manga(this, provider, '/series/' + manga.series_slug, manga.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL(manga.Identifier, this.URI).href);
        const nextdata = await FetchWindowScript<JSONNextManga>(request, '__NEXT_DATA__', 500);
        return nextdata.props.pageProps.series.chapters.map(chapter => new Chapter(this, manga, manga.Identifier+'/'+chapter.chapter_slug, chapter.chapter_name));

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const nextdata = await FetchWindowScript<JSONNextMangaID>(request, '__NEXT_DATA__', 500);
        const chapterid = nextdata.props.pageProps.data.id;

        request = new FetchRequest(new URL('/series/chapter/' + chapterid, apiUrl).href);
        const data = await FetchJSON<JSONChapters>(request);
        return data.content.images.map(element => {
            return new Page(this, chapter, new URL(element, apiUrl));
        });
    }

}
