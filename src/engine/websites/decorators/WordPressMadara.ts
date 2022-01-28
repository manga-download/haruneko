import { FetchRequest, FetchCSS, FetchHTML } from '../../FetchProvider';
import { MangaScraper, DecoratableMangaScraper, MangaPlugin, Manga, Chapter, Page } from '../../providers/MangaPlugin';
import DeProxify from '../../transformers/ImageLinkDeProxifier';

interface MangaID {
    readonly post: string;
    readonly slug: string;
}

const pathname = '';
const pathpaged = '/page/{page}/';
const queryMangaTitle = 'head meta[property="og:title"]';
const queryMangaListLinks = 'div.post-title h3 a, div.post-title h5 a';
const queryChapterListLinks = 'ul li.wp-manga-chapter > a';
const queryPageListLinks = 'div.page-break img';

async function delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/***************************************************
 ******** Manga from URL Extraction Methods ********
 ***************************************************/

export async function FetchMangaCSS(this: MangaScraper, provider: MangaPlugin, url: string, query: string = queryMangaTitle): Promise<Manga> {
    const uri = new URL(url);
    const request = new FetchRequest(uri.href);
    const data = await FetchHTML(request);
    const post = data.querySelector<HTMLElement>('div#manga-chapters-holder')?.dataset?.id;
    const slug = uri.pathname;
    const element = data.querySelector<HTMLElement>(query);
    const title = (element instanceof HTMLMetaElement ? element.content : element.textContent).trim();
    return new Manga(this, provider, JSON.stringify({ post, slug }), title);
}

// Class Decorator
export function MangaCSS(query: string = queryMangaTitle) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchManga(this: MangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
                return FetchMangaCSS.call(this, provider, url, query);
            }
        };
    };
}

/***********************************************
 ******** Manga List Extraction Methods ********
 ***********************************************/

async function FetchMangasCSS(this: MangaScraper, provider: MangaPlugin, request: FetchRequest, query = queryMangaListLinks): Promise<Manga[]> {
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const container = element.closest<HTMLElement>('div.page-item-detail, div.manga');
        const post = container?.querySelector<HTMLElement>('div[data-post-id]')?.dataset?.postId || '';
        const slug = element.pathname;
        const title = element.text.trim();
        return new Manga(this, provider, JSON.stringify({ post, slug }), title.trim());
    });
}

export async function FetchMangasMultiPageCSS(this: MangaScraper, provider: MangaPlugin, query = queryMangaListLinks, throttle = 0, path = pathpaged): Promise<Manga[]> {
    const mangaList = [];
    for(let page = 1, run = true; run; page++) {
        const uri = new URL(path.replace('{page}', `${page}`), this.URI);
        const request = new FetchRequest(uri.href);
        const mangas = await FetchMangasCSS.call(this, provider, request, query);
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        await delay(throttle);
    }
    return mangaList;
}

// Class Decorator
export function MangasMultiPageCSS(query = queryMangaListLinks, throttle = 0, path = pathpaged) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageCSS.call(this, provider, query, throttle, path);
            }
        };
    };
}

export async function FetchMangasMultiPageAJAX(this: MangaScraper, provider: MangaPlugin, query = queryMangaListLinks, throttle = 0, path = pathname): Promise<Manga[]> {
    const mangaList = [];
    // inject `madara.query_vars` into any website using wp-madara to see full list of supported vars
    const form = new URLSearchParams({
        'action': 'madara_load_more',
        'template': 'madara-core/content/content-archive',
        'vars[paged]': '0',
        'vars[post_type]': 'wp-manga',
        'vars[posts_per_page]': '250'
    });
    for (let page = 0, run = true; run; page++) {
        form.set('page', `${page}`);
        const uri = new URL(path + '/wp-admin/admin-ajax.php', this.URI);
        const request = new FetchRequest(uri.href, {
            method: 'POST',
            body: form.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': this.URI.href
            }
        });
        const mangas = await FetchMangasCSS.call(this, provider, request, query);
        mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        await delay(throttle);
    }
    return mangaList;
}

// Class Decorator
export function MangasMultiPageAJAX(query = queryMangaListLinks, throttle = 0, path = pathname) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
                return FetchMangasMultiPageAJAX.call(this, provider, query, throttle, path);
            }
        };
    };
}

/*************************************************
 ******** Chapter List Extraction Methods ********
 *************************************************/

export async function FetchChaptersCSS(this: MangaScraper, manga: Manga, request: FetchRequest, query = queryChapterListLinks): Promise<Chapter[]> {
    const data = await FetchCSS<HTMLAnchorElement>(request, query);
    return data.map(element => {
        const slug = element.pathname;
        const title = element.text.trim();
        return new Chapter(this, manga, slug, title);
    });
}

export async function FetchChaptersSinglePageCSS(this: MangaScraper, manga: Manga, query = queryChapterListLinks): Promise<Chapter[]> {
    const id = JSON.parse(manga.Identifier) as MangaID;
    const uri = new URL(id.slug, this.URI);
    const request = new FetchRequest(uri.href);
    const chapters = await FetchChaptersCSS.call(this, manga, request, query);
    if(!chapters.length) {
        throw new Error();
    } else {
        return chapters;
    }
}

// Class Decorator
export function ChaptersSinglePageCSS(query = queryChapterListLinks) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageCSS.call(this, manga, query);
            }
        };
    };
}

export async function FetchChaptersSinglePageAJAX(this: MangaScraper, manga: Manga, query = queryChapterListLinks, path = pathname): Promise<Chapter[]> {
    const id = JSON.parse(manga.Identifier) as MangaID;
    const uri = new URL(path + '/wp-admin/admin-ajax.php', this.URI);
    const request = new FetchRequest(uri.href, {
        method: 'POST',
        body: new URLSearchParams({
            'action': 'manga_get_chapters',
            'manga': id.post
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': this.URI.href
        }
    });
    return FetchChaptersCSS.call(this, manga, request, query);
}

// Class Decorator
export function ChaptersSinglePageAJAX(query = queryChapterListLinks, path = pathname) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchChapters(this: MangaScraper, manga: Manga): Promise<Chapter[]> {
                return FetchChaptersSinglePageAJAX.call(this, manga, query, path);
            }
        };
    };
}

/**********************************************
 ******** Page List Extraction Methods ********
 **********************************************/

export async function FetchPagesSinglePageCSS(this: MangaScraper, chapter: Chapter, query = queryPageListLinks): Promise<Page[]> {
    const uri = new URL(chapter.Identifier, this.URI);
    const request = new FetchRequest(uri.href);
    const data = await FetchCSS<HTMLImageElement>(request, query);
    return data.map(element => {
        const link = new URL((element.dataset.src || element.srcset || element.src).trim(), uri);
        /*
        if(/data:image/.test(link.href)) {
            return link;
        }
        */
        return new Page(this, chapter, DeProxify(link), {});
    });
}

// Class Decorator
export function PagesSinglePageCSS(query = queryPageListLinks) {
    return function DecorateClass<T extends { new(...args: any[]) : DecoratableMangaScraper }>(ctor: T): T {
        return class extends ctor {
            public async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
                return FetchPagesSinglePageCSS.call(this, chapter, query);
            }
        };
    };
}

/*
    async _getPages(chapter) {
        let uri = new URL(chapter.id, this.url);
        uri.searchParams.set('style', 'list');
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);
        // HACK: Some Madara websites have added the '?style=list' pattern as CloudFlare WAF rule
        //       => Try without style parameter to bypass CloudFlare matching rule
        if(!data || !data.length) {
            uri.searchParams.delete('style');
            request = new Request(uri, this.requestOptions);
            data = await this.fetchDOM(request, this.queryPages);
        }
        return data.map(element => {
            element.src = element.dataset['src'] || element['srcset'] || element.src;
            if (element.src.includes('data:image')) {
                return element.src.match(/data:image[^\s'"]+/)[0];
            } else {
                const uri = new URL(this.getAbsolutePath(element, request.url));
                // HACK: bypass proxy for https://website.net/wp-content/webpc-passthru.php?src=https://website.net/wp-content/uploads/WP-manga/data/manga/chapter/001.jpg&nocache=1?ssl=1
                const canonical = uri.searchParams.get('src');
                if(canonical && /^https?:/.test(canonical)) {
                    uri.href = canonical;
                }
                return this.createConnectorURI({
                    // HACK: bypass 'i0.wp.com' image CDN to ensure original images are loaded directly from host
                    url: uri.href.replace(/\/i\d+\.wp\.com/, ''),
                    referer: request.url
                });
            }
        });
    }

    async _handleConnectorURI(payload) {
        let request = new Request(payload.url, this.requestOptions);
        request.headers.set('x-referer', payload.referer);
        let response = await fetch(request);
        let data = await response.blob();
        data = await this._blobToBuffer(data);
        this._applyRealMime(data);
        return data;
    }

    async _getMangaFromURI(uri) {
        const request = new Request(new URL(uri), this.requestOptions);
        const data = await this.fetchDOM(request, this.queryTitleForURI);
        const element = [...data].pop();
        const title = (element.content || element.textContent).trim();
        return new Manga(this, uri, title);
    }
*/