import { Tags } from '../Tags';
import icon from './SirenKomik.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

import { DRMProvider } from './SirenKomik.DRM';

type APIMangas = {
    data: {
        manga: {
            title: string;
            slug: string;
        }[];
    }
};

const chapterScript = `
    new Promise(resolve => {
        resolve([...document.querySelectorAll('a[href*="/chapter"]')].map(anchor => {
            const titleContainer = anchor.querySelector('h3');
            const bloat = titleContainer.querySelector('span');
            bloat?.parentElement.removeChild(bloat);
            return {
                id: anchor.pathname,
                title : titleContainer.innerText.trim()
            };
        }));
    });
`;

@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.bg-gray-800 div img.select-none ')].map(img => img.src)`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm: DRMProvider;
    private readonly apiUrl = new URL('https://sirenkomik.xyz/api/');

    public constructor() {
        super('sirenkomik', 'SirenKomik', 'https://sirenkomik.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
        this.#drm = new DRMProvider();
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return this.#drm.UpdateAuthToken(this.URI);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const title = await FetchWindowScript<string>(new Request(uri), `document.querySelector('div.grid img.object-cover').alt.trim();`, 1500);
        return new Manga(this, provider, uri.pathname, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data: { manga } } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/list?page=${page}&per_page=12&status=All&type=All&sort=project`, this.apiUrl), {
                    headers: await this.#drm.GetHeaders(),
                }));
                const mangas = manga.map(({ slug, title }) => new Manga(this, provider, `/manga/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}