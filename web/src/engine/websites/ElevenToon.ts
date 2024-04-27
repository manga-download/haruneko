import { Tags } from '../Tags';
import icon from './ElevenToon.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector('.homelist-title span').textContent.trim()
    };
}

@Common.MangaCSS(/^https?:\/\/www\.11toon\d*\.com\/bbs\/board\.php\?bo_table=toons&stx=[^/]+/, '#cover-info h2', Common.ElementLabelExtractor(), true )
@Common.MangasMultiPageCSS('/bbs/board.php?bo_table=toon_c&type=upd&page={page}', 'ul.homelist li[data-id] a', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageJS('img_list', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('11toon', `11toon`, 'https://www.11toon.com', Tags.Language.Korean, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const uri = new URL(this.URI);
        const request = new Request(uri.href);
        this.URI.href = await FetchWindowScript(request, `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.searchParams.set('page', String(page));
        const request = new Request(url.href);
        const data = await FetchCSS(request, 'ul#comic-episode-list li button.episode');
        return data.map(element => {
            const title = element.querySelector('div.episode-title').textContent.replace(manga.Title, '').trim();
            const link = new URL(element.getAttribute('onclick').split('\'')[1], request.url);
            return new Chapter(this, manga, link.pathname + link.search, title);
        });
    }
}