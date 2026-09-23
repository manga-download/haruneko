import { Tags } from '../Tags';
import icon from './SubManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/serie\/[^/]+$/, 'h1.manga-title-centered')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.manga-card', Common.PatternLinkGenerator('/biblioteca?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.manga-title').textContent.trim()
}))
@Common.ChaptersSinglePageCSS('div.chapter-card-item a.chapter-link')
@Common.PagesSinglePageCSS('div#all img.img-responsive')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('submanhwa', 'SubManhwa', 'https://submanhwa.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Spanish, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/biblioteca', this.URI)), '');
    }
}