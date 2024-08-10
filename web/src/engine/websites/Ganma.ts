import { Tags } from '../Tags';
import icon from './Ganma.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIRequest<T> = {
    success: boolean;
    root: T
}

type APIManga = {
    id: string,
    title: string,
    class : string
}

type APIBox = {
    boxes: {
        class: string,
        id: string,
        panels: APIManga[]
    }[]
}

type APIChapters = {
    items: {
        id: string,
        title: string,
        number: number,
        subtitle: string
        page: APIPages
    }[]
}

type APIPages = {
    baseUrl: string,
    token : string,
    files: string[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ganma', `GANMA!`, 'https://ganma.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const request = new Request(new URL('/api/1.0/magazines/web/' + new URL(url).pathname.split('/').at(-1), this.URI), {
            headers: {
                'X-From': this.URI.href
            }
        });
        const { root: { id, title } } = await FetchJSON<APIRequest<APIManga>>(request);
        return new Manga(this, provider, id, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ...await this.GetMangasTop(provider),
            ...await this.GetMangasCompleted(provider)
        ];
    }

    private async GetMangasCompleted(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/api/1.1/ranking?flag=Finish', this.URI), {
            headers: {
                'X-From': this.URI.href
            }
        });
        const { root } = await FetchJSON<APIRequest<APIManga[]>>(request);
        return root.map(manga => new Manga(this, provider, manga.id, manga.title.trim()));
    }

    private async GetMangasTop(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/api/2.2/top', this.URI), {
            headers: {
                'X-From': this.URI.href
            }
        });
        const { root: { boxes } } = await FetchJSON<APIRequest<APIBox>>(request);
        return boxes.reduce((accumulator, box) => {
            const mangas = box.panels.filter(panel => panel.class === 'CustomTopMagazinePanel')
                .map(panel => new Manga(this, provider, panel.id, panel.title.trim()));
            return accumulator.concat(mangas);
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`/api/1.0/magazines/web/${manga.Identifier}`, this.URI), {
            headers: {
                'X-From': this.URI.href
            }
        });
        const { root: { items } } = await FetchJSON<APIRequest<APIChapters>>(request);
        return items.map((chapter, index) => {
            const title = ((chapter.number || index + 1) + ': 【' + chapter.title + '】 ' + (chapter.subtitle || '')).trim();
            return new Chapter(this, manga, chapter.id, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/1.0/magazines/web/${chapter.Parent.Identifier}`, this.URI), {
            headers: {
                'X-From': this.URI.href
            }
        });
        const { root: { items } } = await FetchJSON<APIRequest<APIChapters>>(request);
        const pages = items.find(item => item.id === chapter.Identifier).page;
        return pages.files.map(image => new Page(this, chapter, new URL(`${image}?${pages.token}`, pages.baseUrl)));
    }
}