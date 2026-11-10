import { Tags } from '../Tags';
import icon from './Onisaga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON, FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';

type APIResult<T> = {
    json: T;
};

type APIMangas = {
    items: APIManga[];
    nextCursor: string;
};

type APIManga = {
    id: string;
    slug: string;
    title: string;
    units: {
        title: string;
        releaseId: string;
    }[];
};

type HydratedLanguages = {
    alternatives: {
        href: string;
    }[];
};

/*
type ChapterManifest = {
    bootstrap: {
        manifest: {
            pages: {
                url: string;
            }[];
        };
    };
};*/

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['ja', Tags.Language.Japanese],
    ['pt-br', Tags.Language.Portuguese],
    ['pt', Tags.Language.Portuguese],
]);

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private apiURL = `${this.URI.origin}/api/rpc/`;

    public constructor() {
        super('onisaga', 'Onisaga', 'https://onisaga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(this.URI), `
            new Promise((resolve, reject) => {
	            const formData = new URLSearchParams();
	            formData.append("action", "confirm");
	            formData.append("next", "/");

	            fetch('/api/age-confirmation', {
			            method: "POST",
			            body: formData
		            })
		            .then(response => resolve())
		            .catch(error => resolve());
            });
        `, 500);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/title/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await this.FetchTRPC<APIManga>('./account/titleView', { slug: url.split('/').at(-1) });
        return new Manga(this, provider, `/title/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let cursor: string = undefined, run = true; run;) {
                const payload = {
                    limit: 100,
                    ...cursor && { cursor }
                };
                const { items, nextCursor } = await this.FetchTRPC<APIMangas>('./catalog/browse', payload);
                const mangas = items.map(({ slug, title }) => new Manga(this, provider, `/title/${slug}`, title));
                yield* mangas;
                run = !!nextCursor; cursor = nextCursor;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const languageData = await FetchNextJS<HydratedLanguages>(new Request(new URL(`${manga.Identifier}?chapters=all`, this.URI)), data => 'alternatives' in data);

        // mature manga needs rpc to get chapters
        if (!languageData) {
            const slug = manga.Identifier.split('/').at(-1);
            const { units } = await this.FetchTRPC<APIManga>('./account/titleView', { slug });
            return units.reverse().map(({ title, releaseId }) => new Chapter(this, manga, `/read/${slug}/${releaseId}`, title));
        };

        const languages = languageData.alternatives.map(({ href }) => new URL(href, this.URI).searchParams.get('lang'));

        type This = typeof this;
        const chaptersData = await Array.fromAsync(async function* (this: This) {
            for (const lang of languages) {
                for (let cursor: string = undefined, run = true; run;) {
                    const doc = await FetchHTML(new Request(new URL(`${manga.Identifier}?chapters=all&order=desc&lang=${lang}${cursor ? `&cc=${cursor}` : ''}`, this.URI)));
                    const cursorElement = doc.querySelector<HTMLAnchorElement>('nav[aria-label="Chapter pages"] a:last-of-type');
                    cursor = cursorElement ? new URL(cursorElement.href, this.URI).searchParams.get('cc') : undefined;

                    const elements = [...doc.querySelectorAll<HTMLElement>('a[data-unit], details[data-unit]')];
                    const chapters = elements.map(element => {
                        const row = element.querySelector(':scope > summary') ?? element;
                        const number = parseInt(row.querySelector('span[class*="_num"]').textContent.match(/\d+/)[0]);

                        const versions = element.tagName === 'DETAILS' ? [...element.querySelectorAll('li')] : [element];
                        return versions.map(version => {
                            const link: HTMLAnchorElement = version instanceof HTMLAnchorElement ? version : version.querySelector('a[href^="/read/"]');
                            const group = version.querySelector('a[href^="/group/"]')?.textContent.trim();
                            const chapter = new Chapter(this, manga, link.pathname, [`Chapter ${number}`, `[${lang}]`, group ? `[${group}]` : undefined].joinTitleSegments(), ...[chapterLanguageMap.get(lang)].filter(Boolean));
                            return { number, chapter };
                        });
                    });
                    yield* chapters.flat();

                    run = !!cursor;
                }
            }
        }.call(this));
        // return  globally sorted chapters across multiple languages
        return chaptersData.sort((self, other) => other.number - self.number).map(({ chapter }) => chapter);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagesData = await FetchNextJS<{ pages: { url: string }[]; }>(new Request(new URL(chapter.Identifier, this.URI)), data => 'pages' in data && Array.isArray(data['pages']));
        if (pagesData) {
            return pagesData.pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
        };

        // website is bugged itself because 'age confirmation' cookie is required to download pictures but is inaccessible
        /*const [, , slug, id] = chapter.Identifier.split('/');
        const { bootstrap: { manifest: { pages } } } = await this.FetchTRPC<ChapterManifest>(`./account/readerView`, { releaseId: id, slug });
        return pages.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
        */

        throw new Error(`Adult content is bugged on website, so its disabled for now`);
    };

    private async FetchTRPC<T extends JSONElement>(endpoint: string, payload: JSONElement/*, meta: JSONElement = undefined*/): Promise<T> {
        const { json } = await FetchJSON<APIResult<T>>(new Request(new URL(new URL(endpoint, this.apiURL)), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Origin: this.URI.origin,
                Referer: this.URI.href,
                'Sec-Fetch-Site': 'same-site'
            }, body: JSON.stringify({ json: payload })
        }));
        return json;
    };
}