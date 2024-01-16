import { Tags } from '../Tags';
import icon from './CyComi.webp';
import type { Priority } from '../taskpool/DeferredTask';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://web.cycomi.com/api';

    public constructor() {
        super('cycomi', `CyComi`, 'https://cycomi.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.split('/').pop();
        const request = new Request(`${this.apiURL}/title/detail?titleId=${id}`);
        const { data } = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, data.titleId.toString(), data.titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for(let page = 0, run = true; run; page++) {
            const request = new Request(`${this.apiURL}/home/paginatedList?limit=${50}&page=${page}`);
            const { data } = await FetchJSON<APIMangas>(request);
            const mangas = data.reduce((accumulator: Manga[], entry) => {
                if(entry) {
                    const titles = entry.titles.map(manga => new Manga(this, provider, manga.titleId.toString(), manga.titleName));
                    accumulator.push(...titles);
                }
                return accumulator;
            }, []);
            mangas.length ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async FetchMangaVolumes(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.apiURL}/singleBook/list?titleId=${manga.Identifier}`);
        const { data, resultCode } = await FetchJSON<APIVolumes>(request);
        return resultCode !== 1 || !data.singleBooks ? [] : data.singleBooks.map(volume => {
            const title = [ volume.name, volume.stories ].filter(item => item).join(' - ');
            return new Chapter(this, manga, '/singleBook/detail?singleBookId=' + volume.id, title);
        }) ?? [];
    }

    private async FetchMangaChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.apiURL}/chapter/list?titleId=${manga.Identifier}`);
        const { data, resultCode } = await FetchJSON<APIChapters>(request);
        return resultCode !== 1 || !data.chapters ? [] : data.chapters.map(chapter => {
            const title = [ chapter.name, chapter.subName ].filter(item => item).join(' - ');
            return new Chapter(this, manga, `/chapter/page/list?titleId=${manga.Identifier}&chapterId=${chapter.id}`, title);
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            ... await this.FetchMangaVolumes(manga),
            ... await this.FetchMangaChapters(manga),
        ];
    }

    private MapPages(container: Chapter, pages: APIPage[]): Page[] {
        return pages.filter(page => page.type === 'image')
            .sort((self, other) => self.pageNumber - other.pageNumber)
            .map(page => new Page(this, container, new URL(page.image), { Referer: this.URI.href }));
    }

    private async FetchVolumePages(volume: Chapter): Promise<Page[]> {
        const request = new Request(this.apiURL + volume.Identifier);
        const { data: { id, chapters } } = await FetchJSON<APIChapters>(request);
        return !chapters ? [] : chapters.reduce(async (accumulator: Promise<Page[]>, chapter) => {
            const url = `${this.apiURL}/singleBook/page/list?singleBookId=${id}&chapterId=${chapter.id}`;
            const { data: { pages }, resultCode } = await FetchJSON<APIPages>(new Request(url));
            return resultCode !== 1 ? accumulator : (await accumulator).concat(this.MapPages(volume, pages));
        }, Promise.resolve<Page[]>([]));
    }

    private async FetchChapterPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(this.apiURL + chapter.Identifier);
        const request = new Request(uri.origin + uri.pathname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titleId: parseInt(uri.searchParams.get('titleId') ?? ''),
                chapterId: parseInt(uri.searchParams.get('chapterId') ?? '')
            })
        });
        const { data: { pages }, resultCode } = await FetchJSON<APIPages>(request);
        return resultCode !== 1 ? [] : this.MapPages(chapter, pages);
    }

    public override async FetchPages(container: Chapter): Promise<Page[]> {
        if(container.Identifier.startsWith('/singleBook/')) {
            return this.FetchVolumePages(container);
        }
        if(container.Identifier.startsWith('/chapter/')) {
            return this.FetchChapterPages(container);
        }
        return [];
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const data = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (page.Link.href.includes('/end_page/')) return data; //https://cycomi.com/title/191 got unencrypted end page
        const encrypted = await new Response(data).arrayBuffer();
        const passphrase = page.Link.pathname.split('/').filter(part => /^[0-9a-zA-Z]{32}$/.test(part)).shift() as string;
        const decrypted = Decrypt(new Uint8Array(encrypted), passphrase);
        return new Blob([ decrypted ], { type: data.type });
    }
}

/*****************************
 **** Adapted from CyComi ****
 *****************************/

type APIManga = {
    data: {
        titleId: number,
        titleName: string,
    }
};

type APIMangas = {
    data: [
        null | {
            titles: APIManga['data'][]
        }
    ]
};

type APIVolume = {
    id: number,
    name: string,
    stories: string,
};

type APIVolumes = {
    data: {
        singleBooks? : APIVolume[]
    },
    resultCode: number
};

type APIChapter = {
    id: number,
    name: string,
    subName: string,
};

type APIChapters = {
    data: {
        id: number,
        chapters? : APIChapter[]
    },
    resultCode: number
};

type APIPage = {
    image: string,
    pageNumber: number,
    type: string,
};

type APIPages = {
    data: {
        pages: APIPage[]
    },
    resultCode: number
};

function MakeKey(passphrase: string) {
    const key = new Uint8Array(Array(256).keys());
    for(let index = 0, indexSwap = 0; index < key.length; index++) {
        indexSwap = (indexSwap + key[index] + passphrase.charCodeAt(index % passphrase.length)) % 256;
        const temp = key[index];
        key[index] = key[indexSwap];
        key[indexSwap] = temp;
    }
    return key;
}

function Decrypt(encrypted: Uint8Array, passphrase: string) {
    const key = MakeKey(passphrase);
    const decrypted = new Uint8Array(encrypted.length);
    for (let index = 0, indexKeySwapSource = 0, indexKeySwapTarget = 0; index < encrypted.length; index++) {
        indexKeySwapSource = (indexKeySwapSource + 1) % 256;
        indexKeySwapTarget = (indexKeySwapTarget + key[indexKeySwapSource]) % 256;
        const temp = key[indexKeySwapSource % 256];
        key[indexKeySwapSource % 256] = key[indexKeySwapTarget],
        key[indexKeySwapTarget] = temp;
        const xor = key[(key[indexKeySwapSource] + key[indexKeySwapTarget]) % 256];
        decrypted[index] = encrypted[index] ^ xor;
    }
    return decrypted;
}

// Original Source

/*
let s = (e,t)=>{
    let n = (e=>{
        let t = new Uint8Array(256);
        t.forEach((e,n)=>{
            t[n] = n
        }
        );
        let n = 0;
        return t.forEach((i,r)=>{
            n = (n + t[r] + e.charCodeAt(r % e.length)) % 256;
            let l = t[r];
            t[r] = t[n],
            t[n] = l
        }
        ),
        t
    }
    )(t)
      , i = 0
      , r = 0
      , l = new Uint8Array(e.length);
    for (let t = 0, a = e.length; t < a; t++) {
        r = (r + n[i = (i + 1) % 256]) % 256;
        let a = n[i % 256];
        n[i % 256] = n[r],
        n[r] = a;
        let o = n[(n[i] + n[r]) % 256];
        l[t] = o ^ e[t]
    }
    return l
}
  , d = e=>new Promise((t,n)=>{
    let i = new FileReader;
    i.addEventListener("error", n),
    i.addEventListener("load", ()=>t(i.result)),
    i.readAsDataURL(new Blob([e]))
}
);
async function c(e) {
    var t;
    if (!e)
        return;
    // determine decryption key (from image URL)
    let n = null === (t = e.match(/\/([0-9a-zA-Z]{32})\//)) || void 0 === t ? void 0 : t[1];
    if (!n)
        return e;
    // axios request
    let i = await o().get(e, {
        responseType: "arraybuffer"
    })
      // decrypt response data
      , r = s(new Uint8Array(i.data), n)
      , l = await d(r)
      , a = l.split(",")[1];
    if (a)
        return ["data:null;base64", a].join(",")
}
*/