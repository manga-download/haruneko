import { Tags } from '../../Tags';
import icon from './MangaNexus.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchJSON, FetchRequest } from '../../FetchProvider';

const nextKey = '0x3KRYWgR4lD4UYPUEvIV';

type JSONMangas = {
    pageProps: {
        mangas: {
           items :{ id: string, name: string, slug: string } []
        }
    }
}

type JSONManga = {
    pageProps: {
        manga: { id: string, name: string, slug: string }
        chapters: { id: string, number: string, slug: string, name: string }[]
    }
}

type JSONChapter = {
    pageProps: {
        manga: { id: string, name: string, slug: string }
        chapter: {
            id: string, number: string, slug: string, name: string, mangaId: string,
            pages: string[]
        }
    }
}

@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganexus', `MangaNexus`, 'https://manganexus.net', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/manganexus\.net\/manga\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, _url : string): Promise<Manga> {
        const slug = _url.split('/').pop();
        const url = new URL('/_next/data/' + nextKey + '/manga/' + slug + '.json?slug=' + slug, this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchJSON<JSONManga>(request);
        return new Manga(this, provider, slug, data.pageProps.manga.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]> {
        const mangalist = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangalist.push(...mangas) : run = false;
        }
        return mangalist;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const url = new URL('/_next/data/' + nextKey + '/lista-de-mangas.json?p=' + page, this.URI).href;
            const request = new FetchRequest(url);
            const data = await FetchJSON<JSONMangas>(request);
            return data.pageProps.mangas.items.map(element => new Manga(this, provider, element.slug, element.name.trim()));
        } catch (error) {
            return [];
        }

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier;
        const url = new URL('/_next/data/' + nextKey + '/manga/' + slug + '.json?slug=' + slug, this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchJSON<JSONManga>(request);
        return data.pageProps.chapters.map(chap => {
            const title = `Capítulo ${chap.number}${chap.name.length != 0 ? ' - ' + chap.name : ''}`;
            return new Chapter(this, manga, chap.slug, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaSlug = chapter.Parent.Identifier;
        const url = new URL('/_next/data/' + nextKey + '/manga/' + mangaSlug + '/capitulo/' + chapter.Identifier + '.json', this.URI).href;
        const request = new FetchRequest(url);
        const data = await FetchJSON<JSONChapter>(request);
        return data.pageProps.chapter.pages.map(page => new Page(this, chapter, new URL(page)));
    }
}