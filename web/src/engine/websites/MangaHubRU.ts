import { Tags } from '../Tags';
import icon from './MangaHubRU.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchWindowScript } from './../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLImageElement): string {
    return element.getAttribute('alt').trim();
}

@Common.MangaCSS(/^{origin}\/title\/[^/]+/, 'img.cover', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/explore?page={page}', 'div.container div.card a.fw-medium')
@Common.PagesSinglePageCSS('img.reader-viewer-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahubru', `MangaHub.ru`, 'https://mangahub.ru', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(this.URI), `window.cookieStore.set('confirm_age', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier.replace('/title/', '/chapters/'), this.URI);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div.detail-chapters a.d-inline-flex');
        return data.map(element => {
            const title = element.textContent.replaceAll(/\s+/g, ' ').trim();
            return new Chapter(this, manga, element.pathname, title);
        });
    }

}