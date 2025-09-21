import { Tags } from '../Tags';
import icon from './ShukanManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SpeedBindVersion } from './decorators/SpeedBinb';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: `/work_list/detail/${anchor.dataset.propsContentWork}/`,
        title: anchor.querySelector<HTMLParagraphElement>('p').textContent.trim()
    };
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.href,
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/work_list\/detail\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasSinglePagesCSS(['/comics/'], 'article a[data-props-mode="comic-detail"]:first-of-type', MangaExtractor)
@Common.ChaptersSinglePageCSS('section a.unit-button', undefined, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016130)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shukanmanga', 'Shukan Manga', 'https://shukanmanga.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}