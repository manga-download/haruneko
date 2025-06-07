import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.content-column h1.series-title')
@Common.MangasMultiPageCSS('/all-series.php?page={page}', 'div.series-grid a.series-card', 1, 1, 0, Common.AnchorInfoExtractor(false, '.series-meta, .series-thumb'))
@Common.PagesSinglePageCSS('div.webtoon-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('merlinscans', 'Merlin Scans', 'https://merlinscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.search = new URLSearchParams({
            page: page.toString(),
            sort: 'desc',
        }).toString();
        const data = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div#chapters-container a.chapter-item');
        return data.map(chapter => {
            const { id, title } = Common.AnchorInfoExtractor(false, 'div.chapter-date').call(this, chapter);
            return new Chapter(this, manga, id, title);
        });
    }
}