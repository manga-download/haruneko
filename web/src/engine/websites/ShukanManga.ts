import { Tags } from '../Tags';
import icon from './ShukanManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/work_list\/detail\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasSinglePageCSS('/comics/', 'article a[data-props-mode="comic-detail"]:first-of-type',
    anchor => ({ id: `/work_list/detail/${anchor.dataset.propsContentWork}/`, title: anchor.querySelector<HTMLParagraphElement>('p').textContent.trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section a.unit-button', undefined, anchor => ({ id: anchor.href, title: anchor.text.trim()}))
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