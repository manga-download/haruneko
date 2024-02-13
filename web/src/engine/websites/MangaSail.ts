import { Tags } from '../Tags';
import icon from './MangaSail.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function IsImage(page: string) {
    return ['png', 'jpg', 'jpeg', 'bmp', 'avif', 'webp'].includes(page.toLowerCase().split('.').pop());
}

@Common.MangaCSS(/^{origin}\/content\/[^/]+$/, 'div.main-content-inner h1.page-header')
@Common.MangasMultiPageCSS('/directory?page={page}', 'table.directory_list tr td:first-of-type a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasail', `MangaSail`, 'https://www.sailmanga.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 && !this.EndsWith(chapterslist, chapters) ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;

    }

    private async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier + '?page=' + page, this.URI).href;
        const request = new Request(url);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'table.chlist tr td:first-of-type a');
        return data.map(anchor => new Chapter(this, manga, anchor.pathname + '?page=all', anchor.text.replace(manga.Title, '').trim()));
    }

    public override async FetchPages(this: MangaScraper, chapter: Chapter): Promise<Page[]> {
        const data: Page[] = await Common.FetchPagesSinglePageJS.call(this, chapter, 'Drupal.settings.showmanga.paths');
        return data.filter(page => IsImage(page.Link.href)); //there may be junk element, like <div> or <script>
    }

    private EndsWith(target: Chapter[], source: Chapter[]) {
        if (target.length < source.length) {
            return false;
        }
        return target[target.length - 1].Identifier === source[source.length - 1].Identifier;
    }

}