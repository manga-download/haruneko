import { Tags } from '../Tags';
import icon from './ReadM.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaInn from './decorators/MangaInn';

function MangaInfosExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('h2').textContent.trim();
    return { id, title };
}

function ChapterInfoExtractor(element: HTMLElement) {
    const id = element.querySelector<HTMLAnchorElement>('#table-episodes-title > h6 > a').pathname;
    const title = element.querySelector<HTMLTableCellElement>('#table-episodes-title').innerText.trim();
    return { id, title };

}
@Common.MangaCSS(/^{origin}\/manga\//, MangaInn.queryMangaTitle)
@MangaInn.MangasMultiPageCSS(MangaInn.queryMangas, MangaInn.pathname, MangaInfosExtractor)
@Common.ChaptersSinglePageCSS(MangaInn.queryChapters, ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaInn.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readm', `Read M`, 'https://readm.org', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}