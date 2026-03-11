import { Tags } from '../Tags';
import icon from './MangaHubRU.webp';
import { DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from './../platform/FetchProvider';

function ChapterLinkResolver(this: DecoratableMangaScraper, manga: Manga) {
    return new URL(`${manga.Identifier}/chapters`, this.URI);
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/title\/[^/]+/, 'img.cover', (img, uri) => ({ id: uri.pathname, title: img.getAttribute('alt').trim() }))
@Common.MangasMultiPageCSS('div.container div.card a.fw-medium', Common.PatternLinkGenerator('/explore?page={page}'))
@Common.ChaptersSinglePageCSS('div.detail-chapters a.d-inline-flex', ChapterLinkResolver)
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
}