import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        url: string;
        name: string;
    }[];
};

type APIChapters = {
    chapter: string;
    name: string;
}[];

type APIPages = {
    images: {
        url: string;
    }[];
}

function CleanMangaTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').replace(/- RAW/i, '').trim();
}

@Common.MangaCSS<HTMLSpanElement>(/^{origin}\/manga-[^/]+\.html$/, 'main nav ul span:last-of-type', (span, uri) => ({ id: uri.pathname, title: CleanMangaTitle(span.innerText) }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), () => {
            window.cookieStore.set('smartlink_shown_guest', '1');
            window.cookieStore.set('smartlink_shown', '1');
        });
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL('/app/manga/controllers/cont.allmanga.php', this.URI)));
        return data.map(({ url, name }) => new Manga(this, provider, url, CleanMangaTitle(name)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = FlatManga.ExtractSlug(manga);
        const uri = new URL(`/app/manga/controllers/cont.Listchapter.php?slug=${slug}`, this.URI);
        const chapters = await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(({ chapter, name }) => new Chapter(this, manga, `/read-${slug}-chapter-${chapter}.html`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [cid] = await FetchCSS<HTMLInputElement>(new Request(new URL(chapter.Identifier, this.URI)), 'input#chapter');
        const { images } = await FetchJSON<APIPages>(new Request(new URL(`/caches/chapterboth/${cid.value}.json`, this.URI)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}
