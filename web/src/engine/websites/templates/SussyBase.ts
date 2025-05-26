import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchJSON } from '../../platform/FetchProvider';

type APIResults<T> = {
    resultados: T,
}

type APIResult<T> = {
    resultado: T,
}

export type APIManga = {
    obr_id: number,
    obr_nome: string,
    obr_slug: string | null,
    capitulos: APIChapter[]
}

export type APIChapter = {
    cap_id: number,
    cap_nome: string
    cap_numero: number
}

type JSONPage = {
    src: string,
};

@Common.ImageAjax()
export class SussyBase extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.sussytoons.wtf/';
    protected cdnUrl = 'https://cdn.sussytoons.site/';
    protected scanId: string;

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/obra/\\d+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaUrl = new URL(url);
        const title = (await FetchCSS<HTMLMetaElement>(new Request(mangaUrl), 'meta[property="og:title"]')).at(0).content.trim();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, __, id, slug] = mangaUrl.pathname.split('/');
        return new Manga(this, provider, JSON.stringify({
            obr_id: parseInt(id),
            obr_slug: slug
        }), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { resultados } = await this.FetchAPI<APIResults<APIManga[]>>('./obras/novos-capitulos?pagina=1&limite=9999&gen_id=4');
        return resultados.map(manga => {
            const slug = manga.obr_slug ?? this.ComputeSlug(manga.obr_nome);
            return new Manga(this, provider, JSON.stringify({
                obr_id: manga.obr_id,
                obr_slug: slug
            }), manga.obr_nome);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { obr_id } = JSON.parse(manga.Identifier) as APIManga;
        const { resultado: { capitulos } } = await this.FetchAPI<APIResult<APIManga>>(`./obras/${obr_id}`);
        return capitulos.map(chapter => new Chapter(this, manga, JSON.stringify({
            cap_id: chapter.cap_id,
            cap_numero: chapter.cap_numero
        }), chapter.cap_nome));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { cap_id, cap_numero }: APIChapter = JSON.parse(chapter.Identifier);
        const { obr_id }: APIManga = JSON.parse(chapter.Parent.Identifier);
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(`./capitulo/${cap_id}/`, this.URI)), 'script:not([src])');
        const pages = this.ExtractData<JSONPage[]>(scripts, 'cap_paginas', 'cap_paginas');
        return pages.map(page => new Page(this, chapter, new URL(`./scans/${this.scanId}/obras/${obr_id}/capitulos/${cap_numero}/${page.src}`, this.cdnUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, token: string = undefined): Promise<T> {
        const request = new Request(new URL(endpoint, this.apiUrl), {
            method: 'GET',
            headers: {
                Referer: this.URI.origin,
                'Scan-id': this.scanId,
                'x-client-hash': token

            },
        });
        return FetchJSON<T>(request);
    }

    private ComputeSlug(slug: string): string {
        return slug.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return parent[keyName];
            }
            for (const child of (Object.values(parent) as JSONElement[]).filter(value => value && typeof value === 'object')) {
                const result = FindValueForKeyName(child);
                if (result) {
                    return result;
                }
            }
            return undefined;
        })(record) as T;
    }
}