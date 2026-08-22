import { Tags } from '../Tags';
import icon from './ReadComicsOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/comic\/[^/]+$/, 'main img.object-cover', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim()
}))
@Common.MangasSinglePageCSS('/comic-list?view=text', 'div.comic-list-layout div.grid a')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section a:has(span.text-brand-400)', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.text-brand-400').textContent.trim()
}))
@Common.PagesSinglePageCSS('div#reader-all img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomicsonline', 'Read Comics Online', 'https://readcomicsonline.ru', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}