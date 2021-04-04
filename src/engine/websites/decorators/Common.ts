import { FetchCSS, FetchRequest } from '../../FetchProvider';
import { MangaScraper, MangaPlugin, Manga } from '../../providers/MangaPlugin';

export async function FetchMangasSinglePageHTML(this: MangaScraper, provider: MangaPlugin, path: string, query: string): Promise<Manga[]> {
    const uri = new URL(path, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const id = element.pathname;
        const title = element.text.trim();
        return new Manga(this, provider, id, title);
    });
}

/*
export function MangasSinglePageHTML(path: string, query: string) {
    return function DecorateClass<T extends { new(...args: any[]) : MangaScraper}>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasSinglePageHTML.call(this, provider, path, query);
            }
        };
    };
}
*/

export async function FetchMangasMultiPageHTML(this: MangaScraper, provider: MangaPlugin, path: string, query: string): Promise<Manga[]> {
    const mangaList = [];
    for(let page = 1, run = true; run; page++) {
        const mangas = await FetchMangasSinglePageHTML.call(this, provider, path.replace('{page}', `${page}`), query);
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
    }
    return mangaList;
}

/*
export function MangasMultiPageHTML(path: string, query: string) {
    return function DecorateClass<T extends { new(...args: any[]) : MangaScraper}>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageHTML.call(this, provider, path, query);
            }
        };
    };
}
*/