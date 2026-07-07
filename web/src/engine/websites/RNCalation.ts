import { Tags } from '../Tags';
import icon from './RNCalation.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    chapters: {
        id: number;
        number: number;
        label: string;
    }[];
    pages: number;
};

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.comic-card', Common.PatternLinkGenerator('/library?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLImageElement>('img.card-media').alt.trim()
}))
@Common.PagesSinglePageCSS<HTMLImageElement>('div.page-img-wrap img.page-img', img => img.dataset.fbWp || img.dataset.src || img.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('traduccionesamistosas', 'RNCalation', 'https://rncalation.online', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters: chaptersData, pages } = await FetchJSON<APIChapters>(new Request(new URL(`./chapters/list?slug=${manga.Identifier.split('/').at(-1)}&page=${page}`, this.apiURL)));
                const chapters = chaptersData.map(({ number, label }) => new Chapter(this, manga, `${manga.Identifier}/cap/${number}`, label.replace(manga.Title, '').trim() || label.trim()));
                yield* chapters;
                run = page < pages;
            }
        }.call(this));
    }
}