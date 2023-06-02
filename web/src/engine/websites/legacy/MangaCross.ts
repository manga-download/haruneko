import { Tags } from '../../Tags';
import icon from './MangaCross.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest } from '../../FetchProvider';

type APIMangas = {
    comics: APIManga[]
}

type APIManga = {
    dir_name: string,
    title: string,
}

type APIChapters = {
    comic: {
        episodes: APIChapter[]
    }
}

type APIChapter = {
    id: number,
    volume: string,
    title: string,
    status: string
    page_url: string,
}

type APIPages = {
    episode_pages: {
        image: {
            pc_url : string
        }
    }[]
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacross', `MangaCross`, 'https://mangacross.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(/^https?:\/\/mangacross\.jp\/comics\/[^/]+\/$/).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const id = uri.pathname.match(/comics\/([^/]+)\//)[1];
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLHeadElement>(request, 'head title');
        const title = data[0].textContent.split('|')[0].trim();
        return new Manga(this, provider, id, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('/api/comics.json', this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIMangas>(request);
        return data.comics.map(comic => new Manga(this, provider, comic.dir_name, comic.title.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/api/comics/${manga.Identifier}.json`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIChapters>(request);
        return data.comic.episodes.filter(episode => episode.status == 'public').map(episode => {
            let title = episode.volume + ' ';
            title += episode.title ? episode.title : '';
            return new Chapter(this, manga, episode.page_url, title.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`${chapter.Identifier}/viewer.json`, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchJSON<APIPages>(request);
        return data.episode_pages.map(page => new Page(this, chapter, new URL(page.image.pc_url)));
    }
}