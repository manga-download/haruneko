import { Tags } from '../Tags';
import icon from './MangaPoisk.webp';
import { FetchCSS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+/, 'header.card-header h1 span')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.grid div.manga-card > a', 1, 1, 0, (element: HTMLAnchorElement) => ({ id: element.pathname, title: element.text.trim() }))
@Common.PagesSinglePageCSS('img[data-page]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapoisk', 'MangaPoisk', 'https://mangapoisk.io', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const data = await FetchCSS<HTMLSpanElement>(new Request(new URL(manga.Identifier + `?tab=chapters&page=` + page, this.URI)), '#page-content span.chapter-title');
                const chapters = data.map(element => new Chapter(this, manga, element.closest('a').pathname, element.innerText.trim()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }
}