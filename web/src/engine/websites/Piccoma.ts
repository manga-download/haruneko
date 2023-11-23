import { Tags } from '../Tags';
import icon from './PiedPiper.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest, FetchWindowScript } from '../FetchProvider';

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
                viewer: {
                    pData?: NextPages
                },
            }
        }
    }
}

type NextChapters = {
    id: string,
    title: string,
    volume: number,
    is_free: 'Y' | 'N',
}[];

type NextPages = {
    isScrambled: boolean,
    img: NextImage[],
};

type NextImage = {
    path: string,
    width: number,
    height: number,
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('piccoma-fr', 'Piccoma (French)', 'https://piccoma.com/fr', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
    }

    private getAPI(endpoint: string): URL {
        return new URL(this.URI.href + '/api/haribo/api/public/v2' + endpoint);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.href}/product(/episode)?/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = url.split('/').pop();
        const request = new FetchRequest(`${this.URI.href}/product/${id}`);
        const [ element ] = await FetchCSS<HTMLMetaElement>(request, 'meta[property="og:title"]');
        return new Manga(this, provider, id, element.content.split('|').shift().trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const vowels = 'aeiou'.split('');
        for (const word of vowels) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.getMangasFromPage(word, page, provider);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return [...new Set(mangaList.map(manga => manga.Identifier))].map(id => mangaList.find(manga => manga.Identifier === id));
    }

    private async getMangasFromPage(word: string, page: number, provider: MangaPlugin): Promise<Manga[]> {
        const uri = this.getAPI('/search/product');
        uri.searchParams.set('search_type', 'P');
        uri.searchParams.set('word', word);
        uri.searchParams.set('page', `${page}`);
        const { data: { p_products: entries } } = await FetchJSON<APIMangas>(new FetchRequest(uri.href));
        return entries.map(entry => new Manga(this, provider, `${entry.product_id}`, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.URI.href}/product/episode/${manga.Identifier}`);
        const [ { text: json } ] = await FetchCSS<HTMLScriptElement>(request, 'script#__NEXT_DATA__');
        const chapters = (JSON.parse(json) as NextData).props.pageProps.initialState.episode.episodeList.episode_list;
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(`${this.URI.href}/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`);
        const data = await FetchWindowScript<FooBar>(request, `(${script})()`, 2500);
        console.log('Scrambled Images:', data);
        return data.map(entry => new Page(this, chapter, new URL(entry.link), {}));
    }
}

type Tile = {
    x: number,
    y: number,
    w: number,
    h: number,
};

type TileMap = {
    s: Tile, // source
    d: Tile, // destination
}[];

type FooBar = {
    link: string,
    tiles?: TileMap,
}[];

function script(this: Window) {
    return new Promise<FooBar>(resolve => {

        function extractSeed(url: string): string {
            const uri = new URL(url);
            return globalThis.dd(((e, t) => {
                const i = t.split('').reduce((e, t) => e + parseInt(t), 0) % e.length;
                return e.slice(-i) + e.slice(0, -i);
            })(uri.searchParams.get('q') || '', uri.searchParams.get('expires') || ''));
        }

        /*
        function shuffle(indices: number[], seed: string): number[] {
            return indices;
        }
        */


        function g(t, e) {
            for (let n, o = t + "", i = 0; i < o.length; )
                e[f & i] = f & (n ^= 19 * e[f & i]) + o.charCodeAt(i++);
            return b(e);
        }

        function seedrandom(t, e, n) {
            const o = [], f = g(m((e = 1 == e ? {
                entropy: !0
            } : e || {}).entropy ? [t, b(i)] : null == t ? function() {
                try {
                    var t;
                    return a && (t = a.randomBytes) ? t = t(u) : (t = new Uint8Array(u),
                    (s.crypto || s.msCrypto).getRandomValues(t)),
                    b(t);
                } catch (o) {
                    var e = s.navigator
                      , n = e && e.plugins;
                    return [+new Date, s, n, s.screen, b(i)]
                }
            }() : t, 3), o)
              , p = new h(o)
              , w = function() {
                for (var t = p.g(6), e = c, n = 0; t < l; )
                    t = (t + n) * u,
                    e *= u,
                    n = p.g(1);
                for (; t >= d; )
                    t /= 2,
                    e /= 2,
                    n >>>= 1;
                return (t + n) / e
            };
            return w.int32 = function() {
                return 0 | p.g(4)
            }
            ,
            w.quick = function() {
                return p.g(4) / 4294967296
            }
            ,
            w.double = w,
            g(b(p.S), i),
            (e.pass || n || function(t, e, n, o) {
                return o && (o.S && v(o, p),
                t.state = function() {
                    return v(p, {})
                }
                ),
                n ? (r.random = t,
                e) : t
            }
            )(w, f, "global"in e ? e.global : this == r, e.state)
        }

        const o = function(t) {
            return /(number|string)/i.test(Object.prototype.toString.call(t).match(/^\[object (.*)\]$/)[1]) ? t : isNaN(t) ? Number(String(this.strSeed = t).split('').map(function(t) {
                return t.charCodeAt(0);
            }).join('')) : t;
        };

        const shuffle = function(t: number[], e: string) {
            if (Object.prototype.toString.call(t) !== '[object Array]') return null;
            e = o(e) || 'none';
            const a = seedrandom(e);
            const s = [];
            const u = [];
            for (let c = 0; c < t.length; c++) u.push(c);
            for (let c = 0; c < t.length; c++) {
                const l = i(a, 0, u.length - 1);
                const d = u[l];
                u.splice(l, 1),
                s.push(t[d]);
            }
            return s;
        };

        /*
        function shuffle(t, e) {
            if (!n(t))
                return null;
            e = o(e) || "none";
            for (var r = t.length, a = seedrandom(e), s = [], u = [], c = 0; c < r; c++)
                u.push(c);
            for (c = 0; c < r; c++) {
                var l = i(a, 0, u.length - 1)
                  , d = u[l];
                u.splice(l, 1),
                s.push(t[d])
            }
            return s;
        }
        */

        function getGroupedTiles(image: NextImage) {
            const tileSize = 50;
            const columns = Math.ceil(image.width / tileSize);
            const tileCount = columns * Math.ceil(image.height / tileSize);
            const result: Record<string, Tile[]> = {};
            for (let index = 0; index < tileCount; index++) {
                const row = Math.floor(index / columns);
                const column = index - row * columns;
                const offsetX = column * tileSize;
                const offsetY = row * tileSize;
                const tile = {
                    x: offsetX,
                    y: offsetY,
                    w: offsetX + tileSize > image.width ? image.width - offsetX : tileSize,
                    h: offsetY + tileSize > image.height ? image.height - offsetY : tileSize,
                };
                const group = `${tile.w}-${tile.h}`;
                result[group] || (result[group] = []), result[group].push(tile);
            }
            return result;
        }

        function extractTileMap(image: NextImage) {
            const result: TileMap = [];
            const seed = extractSeed(image.path);
            const groups = getGroupedTiles(image);
            for (const group in groups) {
                const tiles = groups[group];
                const indexMap = shuffle([...tiles.keys()], seed);
                result.push(...tiles.map((tile, index) => {
                    return {
                        s: tiles[indexMap[index]],
                        d: tile,
                    };
                }));
            }
            return result;
        }

        const isScrambled = globalThis.__NEXT_DATA__.props.pageProps.initialState.viewer.pData.isScrambled;
        const images = (globalThis.__NEXT_DATA__ as NextData).props.pageProps.initialState.viewer.pData.img;

        const result = images.map(image => {
            const uri = new URL(image.path);
            return {
                link: uri.href,
                tiles: isScrambled ? extractTileMap(image) : undefined,
            };
        });

        resolve(result);
    });
}