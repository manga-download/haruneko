import { Tags } from '../Tags';
import icon from './TenshiID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.bigor div.tt').textContent.trim();
    return { id, title };
}

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/)
@Common.MangasMultiPageCSS('/komik/?page={page}', 'div.bs div.bsx a', 1, 1, 0, MangaExtractor)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tenshiid', 'Tenshi.ID', 'https://tenshi.pw', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}