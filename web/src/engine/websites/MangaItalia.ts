import { Tags } from '../Tags';
import icon from './MangaItalia.webp';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('h5').textContent.trim().split('\n')[0]
    };
}
function MangaLabelExtractor(element: HTMLTitleElement) {
    return element.text.split('-').at(0).trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'title', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.series-paginated a.link-series')
@Common.ChaptersSinglePageCSS('div.chapters-list div.col-chapter', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-italia', 'Manga Italia', 'https://mangaita.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Italian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageList: Page[] = [];
        for (let i = 1, run = true; run; i++) {
            const images = await FetchCSS(new Request(new URL(`${chapter.Identifier}/${i}`, this.URI).href), '.book-page img');
            images.length > 0 ? pageList.push(...images.map(image => new Page(this, chapter, new URL(image.getAttribute('src'), this.URI)))) : run = false;
        }
        return pageList;
    }

}
