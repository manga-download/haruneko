import { Tags } from '../Tags';
import icon from './ToonJai.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchNextJS, Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type HydratedManga = {
    name: string;
    slug: string;
    episodes: {
        no: number;
        name: string;
    }[];
};

@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.block:has(img)', Common.PatternLinkGenerator('/latest?page={page}'), 0, anchor => ({
    id: anchor.pathname.split('/').at(-1),
    title: anchor.querySelector('img').alt.replace(/^\u0E1B\u0E01/, '').trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('toonjai', 'ToonJai', 'https://toonjai.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { name, slug } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'slug' in data && 'episodes' in data);
        return new Manga(this, provider, slug, name);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodes } = await FetchNextJS<HydratedManga>(new Request(new URL(`/content/${manga.Identifier}`, this.URI)), data => 'slug' in data && 'episodes' in data);
        return episodes.reverse().map(({ no, name }) => new Chapter(this, manga, `${no}`, ['ตอนที่', no, name].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const response = await Fetch(new Request(new URL(`/content/${chapter.Parent.Identifier}/episode/${chapter.Identifier}`, this.URI), {
            method: 'POST',
            body: JSON.stringify([chapter.Parent.Identifier, parseFloat(chapter.Identifier)]),
            headers: {
                'Next-Action': '60579585cf627287d6bb2527cf3e027b813c476593'
            }
        }));
        const lines = (await response.text()).split(/\r\n?|\n/).filter(line => line);
        const imageArray = <string[]>JSON.parse(lines.find(line => line.startsWith('1:')).slice(2));
        return imageArray.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}
