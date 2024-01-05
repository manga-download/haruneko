import { Tags } from '../Tags';
import icon from './LireScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.text.replace(/Scan/i, '').replace(/VF/i, '').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/\S+\.html$/, 'div.pmovie__header div.pmovie__header-main h1')
@Common.MangasMultiPageCSS('/manga/page/{page}', 'div.sect__content div.item a:first-of-type', 1, 1, 0, Common.AnchorInfoExtractor(false, 'div.item-poster__img'))
@Common.ChaptersSinglePageCSS('ul li div.chapter a', ChapterExtractor)
@Common.PagesSinglePageJS('manga[currentChapter]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lirescan', `LireScan`, 'https://lire-scan.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}