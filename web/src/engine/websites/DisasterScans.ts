import { Tags } from '../Tags';
import icon from './DisasterScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type NEXTDATA = {
    buildId: string
}

type JSONManga = {
    pageProps: {
        comic: { id: string, ComicTitle: string }
        chapters: { chapterID: number, ChapterName: string, chapterNumber: string }[]
    }
}

type JSONMangas = {
    pageProps: {
        comics: { id: string, ComicTitle: string }[]
    }
}

@Common.PagesSinglePageCSS('main > div.maxWidth.container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private nextBuild = '';

    public constructor() {
        super('disasterscans', 'Disaster Scans', 'https://disasterscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        const data = await FetchWindowScript<NEXTDATA>(request, `__NEXT_DATA__`);
        this.nextBuild = data.buildId;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comics/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, _url: string): Promise<Manga> {
        const slug = _url.split('/').pop();
        const url = new URL('/_next/data/' + this.nextBuild + '/comics/' + slug + '.json?slug=' + slug, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<JSONManga>(request);
        return new Manga(this, provider, data.pageProps.comic.id, data.pageProps.comic.ComicTitle.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/comics', this.URI).href;
        const request = new Request(url);
        const data = await FetchWindowScript<JSONMangas>(request, `__NEXT_DATA__.props`);
        return data.pageProps.comics.map(element => new Manga(this, provider, element.id, element.ComicTitle.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaSlug = this.computeMangaSlug(manga);
        const url = new URL('/_next/data/' + this.nextBuild + '/comics/' + mangaSlug + '.json?slug=' + mangaSlug, this.URI).href;
        const request = new Request(url);
        const data = await FetchJSON<JSONManga>(request);
        return data.pageProps.chapters.map(chap => {
            const title = `Chapter ${chap.chapterNumber}${chap.ChapterName.length != 0 ? ' - ' + chap.ChapterName : ''}`;
            return new Chapter(this, manga, `/comics/${mangaSlug}/${chap.chapterID}-chapter-${chap.chapterNumber}`, title);
        });
    }

    computeMangaSlug(manga: Manga) {
        return manga.Identifier + '-' + manga.Title.toLowerCase().split(' ').join('-');
    }

}