import { Tags } from '../Tags';
import icon from './ComicFX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('span.chapternum').textContent.trim();
    return { id, title };
}

function MangaExtractor(element: HTMLAnchorElement) {
    const id = element.pathname;
    const title = element.text.trim().replace(/^Manga/i, '').trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, '.judul-komik h2')
@MangaReader.MangasSinglePageCSS(MangaReader.queryMangas, '/', MangaExtractor)
@Common.ChaptersSinglePageCSS('ul#listch li span.xkiri.pull-left a', ChapterExtractor)
@Common.PagesSinglePageJS('link_canx')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicfx', `Comic FX`, 'https://comicfx.net', Tags.Language.Indonesian, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}