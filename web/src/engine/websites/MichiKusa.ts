import { Tags } from '../Tags';
import icon from './MichiKusa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function MangaInfoExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLDivElement>('div.contents-info div.title').textContent.trim(),
    };
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/index\.html$/, ''),
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/product\/[^/]+$/, 'header.entry-header h1.page-title')
@Common.MangasMultiPageCSS('/product/page/{page}', 'div.entry-content', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.released_episodes div.items div.item a', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('michikusa', `MichiKusa`, 'https://michikusacomics.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}