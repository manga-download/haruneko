import { Tags } from '../Tags';
import icon from './Manga168.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const H = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', 'Referer': 'https://manga168x.com/', 'Origin': 'https://manga168x.com' };

async function Fetch<T>(u: URL): Promise<T> { const r = await fetch(u.href, { headers: H }); if (r.status !== 200) throw new Error(); return await r.json(); }

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = `${this.URI.origin}/api/manga/`;

    constructor() { super('manga168', 'Manga168', 'https://manga168x.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator); }
    get Icon() { return icon; }

    ValidateMangaURL(u: string) { return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+$`).test(u); }

    async FetchManga(p: MangaPlugin, u: string): Promise<Manga> {
        const s = u.split('/').at(-1) || '';
        const r = await Fetch<any>(new URL(`./mangas/${s}`, this.apiURL));
        const id = r.id_manga || r.data?.id_manga || s;
        return new Manga(this, p, id.toString(), r.post_title || r.data?.post_title);
    }

    async FetchChapters(m: Manga): Promise<Chapter[]> {
        const r = await Fetch<any>(new URL(`./mangas/${m.Identifier}`, this.apiURL));
        const cs = r.ero_chapters || r.chapters || r.data?.ero_chapters || [];

        return cs.sort((a: any, b: any) => parseFloat(b.ero_chapter || b.id || 0) - parseFloat(a.ero_chapter || a.id || 0))
            .map((i: any) => {
                const title = (i.post_title || i.title || i.name || 'ตอนใหม่').trim();
                return new Chapter(this, m, (i.ero_chapter || i.id || i.slug).toString(), title);
            });
    }

    async FetchPages(c: Chapter): Promise<Page[]> {
        const mangaId = c.Parent.Identifier;
        const chapterId = c.Identifier;
        const r = await Fetch<{ data: string[] }>(new URL(`./mangas/${mangaId}/${chapterId}/images`, this.apiURL));
        if (!r.data?.length) throw new Error();
        return r.data.map(u => new Page(this, c, new URL(u), { Referer: 'https://manga168x.com/' }));
    }
}