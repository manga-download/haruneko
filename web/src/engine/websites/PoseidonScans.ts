import { FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import * as Common from './decorators/Common';
import icon from './PoseidonScans.webp';

// TODO: fix chapters scraping with a better FetchNextJS implementation
// this one works : https://github.com/manga-download/haruneko/pull/1800

type HydratedManga = {
    manga: {
        slug: string;
        title: string;
    };
};

type HydratedChapters = {
    chapters: { number: number; }[];
};

@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.block.group', Common.PatternLinkGenerator('/series?page={page}'), 0,
    anchor => ({ id: anchor.pathname.split('/').at(-1), title: anchor.querySelector('h2').innerText.trim() }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.reader-vimg')].sort((self, other) => self.dataset.order - other.dataset.order).map(e => e.querySelector('img').src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('poseidonscans', 'Poseidon Scans', 'https://poseidon-scans.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/series/-/', this.URI)), '');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/serie/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { manga: { slug, title } } = await FetchNextJS<HydratedManga>(new Request(new URL(url, this.URI)), data => 'manga' in data);
        return new Manga(this, provider, slug, title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/serie/${manga.Identifier}`, this.URI);
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(uri), data => 'chapters' in data);
        return chapters.map(chapter => new Chapter(this, manga, `${uri.pathname}/chapter/${chapter.number}`, `Chapitre ${chapter.number}`));
    }
}