import { Tags } from '../Tags';
import icon from './MangaBTT.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaInfoExtractor(element: HTMLImageElement) {
    return {
        id: element.closest('a').pathname,
        title: element.getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article#item-detail h1.title-detail')
@Common.MangasMultiPageCSS('/?page={page}', 'div.row div.ModuleContent div.item figure a img', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('div.page-chapter img[data-index]')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabtt', 'MangaBTT', 'https://rawlampo.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL('/Story/ListChapterByStoryID', this.URI), {
            method: 'POST',
            body: new URLSearchParams({ StoryID: manga.Identifier.split('-').pop() }).toString(),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Referer: new URL(manga.Identifier, this.URI).href,
                Origin: this.URI.origin,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });

        const chapters = await FetchCSS<HTMLAnchorElement>(request, 'a[data-id]');
        return chapters.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }

}