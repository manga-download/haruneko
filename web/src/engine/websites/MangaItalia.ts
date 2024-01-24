import { Tags } from '../Tags';
import icon from './MangaItalia.webp';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('p.item-title').textContent.trim()
    };
}

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('h5').textContent.trim().split('\n')[0]
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, '.col > h1')
@Common.MangasMultiPageCSS('/manga?page={page}', '.grid-item-series', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('.col-chapter', ChapterExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga-italia', 'Manga Italia', 'https://manga-italia.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Italian, Tags.Source.Scanlator);
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
