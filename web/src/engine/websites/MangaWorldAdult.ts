import { Tags } from '../Tags';
import icon from './MangaWorldAdult.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const bloat = anchor.querySelector('i');
    if (bloat) {
        anchor.removeChild(bloat);
    }
    const id = anchor.pathname + '?style=list';
    const title = anchor.text.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.info h1.name.bigger')
@Common.MangasMultiPageCSS('/archive?page={page}', 'div.comics-grid div.content a.manga-title')
@Common.ChaptersSinglePageCSS('div.chapters-wrapper div.chapter a.chap', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div#reader div#page img.page-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaworldadult', `Manga World Adult`, 'https://www.mangaworldadult.net', Tags.Language.Italian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}