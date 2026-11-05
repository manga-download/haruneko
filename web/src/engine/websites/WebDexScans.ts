import { Tags } from '../Tags';
import icon from './WebDexScans.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    title: string;
    slug: string;
};

type HydratedPages = {
    initialPages: {
        image_url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'meta[property="og:title"]')
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('a.chapter-card')].map(anchor => ({ id: anchor.pathname, title : anchor.querySelector('.chapter-number').textContent.trim()}));`, 750)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://nrqghtbdrdnoywxjkgkf.supabase.co/rest/v1/';
    private readonly apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycWdodGJkcmRub3l3eGprZ2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4Njg4NDEsImV4cCI6MjA5MjQ0NDg0MX0.Gnrn33_LMxFA9m_OdCpybBZ-Cjcc5rdsJlD8Y9eOICg';

    public constructor() {
        super('webdexscans', 'WebDex Scans', 'https://webdexscans.com', Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/series/-/', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const perPage = 200;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += perPage) {
                const data = await this.FetchAPI<APIManga[]>(`./series?select=id,title,slug&limit=${perPage}&offset=${offset}`);
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, `/series/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        // <img> may not exist because of anti-adblocker, extract them from nextjs
        const { initialPages } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'initialPages' in data);
        return initialPages.map(({ image_url: image }) => new Page(this, chapter, new URL(image, this.URI)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiURL), {
            headers: {
                ApiKey: this.apiKey,
                Authorization: `Bearer ${this.apiKey}`,
            }
        }));
    }
}