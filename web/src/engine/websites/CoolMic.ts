import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIMangas = {
    results: {
        title_id: number;
        title_name: string;
    }[];
};

type JSONChapters = {
    episodes: {
        id: number;
        number: string;
    }[];
};

type APIPages = {
    image_data?: {
        path: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'meta[property="og:title"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    protected readonly apiURL = `${this.URI.origin}/api/v1/`;
    private token: string = undefined;

    public constructor() {
        super('coolmic', 'CoolMic', 'https://coolmic.me', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Official, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.token = await FetchWindowScript<string>(new Request(this.URI), `
            new Promise(async (resolve, reject) => {
                try {
                    await window.cookieStore.set('is_mature', 'true');
                    resolve(document.querySelector('meta[name="csrf-token"]').content);
                } catch(error) {
                    reject(error);
                }
            });
        `);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { results } = await FetchJSON<APIMangas>(new Request(new URL(`./search_titles?page=${page}&per=100`, this.apiURL)));
                const mangas = results.map(({ title_id: id, title_name: name }) => new Manga(this, provider, `/titles/${id}`, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [jsonNode] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '[\\:page-objects]');
        const { episodes } = <JSONChapters>JSON.parse(jsonNode.getAttribute(':page-objects'));
        return episodes.map(({ id, number }) => new Chapter(this, manga, `${id}`, number.trim())).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { image_data } = await this.FetchAPI<APIPages>(`./viewer/comic/episodes/${chapter.Identifier}`);
        if (!image_data) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return image_data.map(({ path }) => new Page(this, chapter, new URL(path)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, body: JSONElement = undefined, referer: string = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiURL), {
            method: body ? 'POST' : 'GET',
            headers: {
                Origin: this.URI.origin,
                'Content-type': 'application/json',
                'X-CSRF-TOKEN': this.token,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: body ? JSON.stringify(body) : undefined

        });
        if (referer) request.headers.set('Referer', referer);
        return FetchJSON<T>(request);
    }
}