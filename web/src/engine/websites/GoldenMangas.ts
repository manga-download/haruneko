import { Tags } from '../Tags';
import icon from './GoldenMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('h3').textContent.trim();
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const divtitle = anchor.querySelector('div.col-sm-5');
    const spanbloat = divtitle.querySelector('span');
    divtitle.removeChild(spanbloat);
    const title = divtitle.textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/[^/]+/, 'header.breadcrumbs div.container h1')
@Common.MangasMultiPageCSS('/mangas&pagina={page}', 'div.mangas a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('ul#capitulos li.row > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div#capitulos_images img.img-responsive')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goldenmangas', `GoldenMangas`, 'https://goldenmangas.top', Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}