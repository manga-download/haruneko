import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRegex } from '../platform/FetchProvider';

type APIManga = {
    id: number,
    name: string,
    slug: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://apis.eternalmangas.com/api/';
    private token: string = undefined;

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.com', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.token = (await FetchRegex(new Request(new URL('./comics', this.URI)), /token\\['"]:\\["']([^\\]+)/g)).at(0);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL('./comics-actu', this.apiUrl), {
            headers: {
                'x-eternal-key': this.token
            }
        }));
        return data.map(manga => new Manga(this, provider, `/ver/${manga.slug}`, manga.name));
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ver/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const [data] = await this.FetchFormHTML<HTMLParagraphElement>(mangaUrl, 'project_slug', 'div#info div:first-of-type p:nth-of-type(2)');
        return new Manga(this, provider, mangaUrl.pathname, data.textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaUrl = new URL(manga.Identifier, this.URI);
        const data = await this.FetchFormHTML<HTMLAnchorElement>(mangaUrl, 'project_slug', 'div.contenedor div.grid a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.textContent.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const data = await this.FetchFormHTML<HTMLImageElement>(chapterUrl, 'chapter_slug', 'img[data-src]');
        return data.map(image => new Page(this, chapter, new URL(image.dataset.src || image.src)));
    }

    private async FetchFormHTML<T extends HTMLElement>(url: URL, inputFormName: string, query: string): Promise<T[]> {
        const [form] = await FetchCSS<HTMLFormElement>(new Request(url), `form:has(input[name="${inputFormName}"])`);
        const parameters = new URLSearchParams();
        [...form.querySelectorAll<HTMLInputElement>('input')].forEach(inputElement => parameters.set(inputElement.name, inputElement.value));
        const request = new Request(new URL(form.getAttribute('action')), {
            method: 'POST',
            body: parameters.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
        return FetchCSS<T>(request, query);
    }

}