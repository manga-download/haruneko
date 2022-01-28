import { Tags } from '../Tags';
import { FetchRequest } from '../FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga } from '../providers/MangaPlugin';
import { MangaCSS, MangasMultiPageCSS, FetchChaptersCSS, PagesSinglePageCSS } from './decorators/WordPressMadara';

@MangaCSS('meta[property="og:title"]:not([content*="Hiperdex"])')
@MangasMultiPageCSS(undefined, 1000, '/manga-list/page/{page}/')
@PagesSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Language.English);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = JSON.parse(manga.Identifier).slug as string;
        const uri = new URL((slug + '/ajax/chapters/').replace(/\/+/g, '/'), this.URI);
        const request = new FetchRequest(uri.href, { method: 'POST' });
        return FetchChaptersCSS.call(this, manga, request);
    }
}