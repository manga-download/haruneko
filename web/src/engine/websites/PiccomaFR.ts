import { type ImageLinks, type TileGroup, script } from './Piccoma';
import { Tags } from '../Tags';
import icon from './Piccoma.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import DeScramble from '../transformers/ImageDescrambler';
import type { Priority } from '../taskpool/TaskPool';

type APIMangas = {
    data: {
        p_products: [{
            product_id: number,
            title: string,
        }]
    }
}

type NextData = {
    props: {
        pageProps: {
            initialState: {
                episode: {
                    episodeList: {
                        episode_list?: NextChapters
                    }
                },
            }
        }
    }
}

type NextChapters = {
    id: string,
    title: string,
}[];

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('piccoma-fr', 'Piccoma (French)', 'https://piccoma.com/fr', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
    }

    private GetAPI(endpoint: string): URL {
        return new URL(this.URI.href + '/api/haribo/api/public/v2' + endpoint);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp('^https://(fr\\.)?piccoma.com/fr/product(/episode)?/\\d+$').test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const request = new Request(`${this.URI.href}/product/${id}`);
        const [ element ] = await FetchCSS<HTMLMetaElement>(request, 'meta[property="og:title"]');
        return new Manga(this, provider, id, element.content.split('|').shift().trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const vowels = 'aeiou'.split('');
        for (const word of vowels) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromPage(word, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return [...new Set(mangaList.map(manga => manga.Identifier))].map(id => mangaList.find(manga => manga.Identifier === id));
    }

    private async GetMangasFromPage(word: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = this.GetAPI('/search/product');
        uri.searchParams.set('search_type', 'P');
        uri.searchParams.set('word', word);
        uri.searchParams.set('page', `${page}`);
        const { data: { p_products: entries } } = await FetchJSON<APIMangas>(new Request(uri.href));
        return entries.map(entry => new Manga(this, provider, `${entry.product_id}`, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.URI.href}/product/episode/${manga.Identifier}`);
        const [ { text: json } ] = await FetchCSS<HTMLScriptElement>(request, 'script#__NEXT_DATA__');
        const chapters = (JSON.parse(json) as NextData).props.pageProps.initialState.episode.episodeList.episode_list;
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(`${this.URI.href}/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const data = await FetchWindowScript<ImageLinks>(request, `(${script})()`, 2500);
        return data.map(entry => new Page(this, chapter, new URL(entry.link), { scrambled: JSON.stringify(entry.tiles) }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.scrambled) {
            return blob;
        }
        return DeScramble(blob, async (bitmap, ctx) => {
            const scrambled: Record<string, TileGroup> = JSON.parse(page.Parameters.scrambled as string);
            for (const key in scrambled) {
                const group = scrambled[key];
                for (let index = 0; index < group.tiles.length; index++) {
                    const d = group.tiles[index];
                    const s = group.tiles[group.indexmap[index]];
                    ctx.drawImage(bitmap, s.x, s.y, group.tileWidth, group.tileHeight, d.x, d.y, group.tileWidth, group.tileHeight);
                }
            }
        });
    }
}