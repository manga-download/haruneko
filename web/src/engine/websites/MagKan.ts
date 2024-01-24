import { Tags } from '../Tags';
import icon from './MagKan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('h2.comic_name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+/, 'h1.ttl')
@Common.MangasSinglePageCSS('/', 'div#main div.panel div.box div.inner', MangaExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('magkan', `MagKan`, 'https://kansai.mag-garden.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI).href);
        const [mainDiv] = await FetchCSS<HTMLDivElement>(request, 'div#main');
        const current = [...mainDiv.querySelectorAll<HTMLAnchorElement>('div#main div.update_summary div.exp ul.btn li a[href*="/assets/files/"]')].map(element => {
            const id = element.pathname.replace(/\/HTML5\/?$/i, '');
            return new Chapter(this, manga, id, element.text.replace('を読む', '').trim());
        });
        const previous = [...mainDiv.querySelectorAll('div#main div.sam_exp div.exp')].map(element => {
            const id = element.querySelector<HTMLAnchorElement>('ul.btn li a[href*="/assets/files/"]').pathname.replace(/\/HTML5\/?$/i, '');
            return new Chapter(this, manga, id, element.querySelector('div.back_number_summary div.ttl').textContent.trim());
        });
        return [...current, ...previous].distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier + '/iPhone/ibook.xml', this.URI);
        const response = await Fetch(new Request(uri.href));
        const data = await response.text();
        const pages = parseInt(data.match(/<total>(\d+)<\/total>/)[1]);
        return new Array<Page>(pages).fill(null).map((_, index) => new Page(this, chapter, new URL(`${chapter.Identifier}/books/images/2/${index + 1}.jpg`, uri)));
    }

}