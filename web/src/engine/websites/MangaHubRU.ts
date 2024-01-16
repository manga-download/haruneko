import { Tags } from '../Tags';
import icon from './MangaHubRU.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from './../platform/FetchProvider';

type APIPages = {
    scans: {id : number, src : string}[]
}

@Common.MangaCSS(/^{origin}\/title\//, '#title-detail div.col div.card-padding-x h1')
@Common.MangasMultiPageCSS('/explore?page={page}', 'div.container div.card a.comic-grid-name')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahubru', `MangaHub.ru`, 'https://mangahub.ru', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier.replace('/title/', '/chapters/'), this.URI);
        const request = new Request(url.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.detail-chapters a.d-inline-flex');
        return data.map(element => {
            const span1 = element.querySelector('span.text-truncate'); //main title to trim
            const span2 = span1.querySelector('span');//secondary title
            let title = '';
            if (span2) {
                span1.removeChild(span2);
                title += span1.textContent.trim();
                title += span2.textContent.startsWith(' - ') ? span2.textContent.trimEnd() : ' - ' + span2.textContent.trim();//make sure there is a separator
            } else {
                title = span1.textContent.trim();
            }

            return new Chapter(this, manga, element.pathname, title);
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI);
        const request = new Request(url.href);
        const data = await FetchCSS<HTMLElement>(request, 'reader[data-store]');
        const jObject: APIPages = JSON.parse(data.shift().dataset.store);
        return jObject.scans.map(element => new Page(this, chapter, new URL(element.src, this.URI), { Referer: this.URI.href }));
    }
}