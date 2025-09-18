import { Tags } from '../Tags';
import icon from './ZenManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';
//import * as devalue from 'devalue';

type APIManga = {
    id: string;
    slug: string;
    name: {
        ru: string;
    }
};

type HydratedChapter = {
    id: string;
    name: string;
    number: number;
    branchId: string;
    volume: number;
};

type HydratedBranch = {
    id: string;
    publishers: {
        name: string;
    }[]
}

type APIPages = {
    pages: {
        image: string;
    }[]
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.inkstory.me/v2/';

    public constructor() {
        super('zenmanga', 'ZenManga', 'https://inkstory.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, name: { ru } } = await FetchJSON<APIManga>(new Request(new URL(`./books/${url.split('/').at(-1)}`, this.apiUrl)));
        return new Manga(this, provider, slug, ru);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 0, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL(`./books?page=${page}&size=200&sort=viewsCount%2Cdesc`, this.apiUrl)));
        return data.map(({ slug, name: { ru } }) => new Manga(this, provider, slug, ru));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`./content/${manga.Identifier}`, this.URI));
        const eventName = Math.random().toString(36).split('').slice(Math.random() * 6 + 4).join('');
        const preload = `(function(eventName) {
            document.addEventListener('@it-astro:server-state-loaded', event => {
                setInterval(() => window.dispatchEvent(new CustomEvent(eventName, { detail: event.serverState })), 250);
            });
        })('${eventName}');`;

        const script = `new Promise(resolve => {
            const eventName = '${eventName}';
            window.addEventListener(eventName, event => {
                const objects = event.detail.get('@inox-tools/request-nanostores');
                const branches = objects.get('current-book-branches');
                const chaptersData = objects.get('current-book-chapters');
                resolve ( {chaptersData , branches});
            }, { once: true });
        });`;

        const data = await FetchWindowPreloadScript(request, preload, script, 0, 7500);



        //const data = await FetchWindowScript(new Request(new URL(`./content/${manga.Identifier}`, this.URI)), chapterScript);
        /*
        const revivers = {
            URL: t => new URL(t),
            Date: t => new Date(t),
        };

        const [script] = await FetchCSS<HTMLScriptElement>(new Request(new URL(`./content/${manga.Identifier}`, this.URI)), 'script#it-astro-state');
        const hydratedData: Record<string, any> = devalue.parse(script.text, revivers).entries().next().value.at(1);
        const chaptersData = hydratedData.get('current-book-chapters') as HydratedChapter[];
        const branches = hydratedData.get('current-book-branches') as HydratedBranch[];
        return chaptersData.map(({ id, branchId, name, number, volume }) => {
            const publishers = branches.find(branch => branch.id === branchId).publishers.map(({ name }) => name).join(' & ');
            const title = ['Том', `${volume}.`, 'Глава', number, name ? `: ${name}` : undefined].join(' ').trim() + ` (${publishers})`;
            return new Chapter(this, manga, id, title);
        });*/
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiUrl)));
        return pages.map(({ image }) => new Page(this, chapter, new URL(image + `&width=700&quality=100&type=jpeg`)));
    }
}