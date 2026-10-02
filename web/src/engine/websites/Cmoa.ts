import { Tags } from '../Tags';
import icon from './Cmoa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SpeedBindVersion } from './decorators/SpeedBinb';

function ChapterExtractor(element: HTMLElement, uri: URL): { id: string; title: string; } {
    const chapterUrl = new URL(element.querySelector<HTMLAnchorElement>('a[href^="/reader/"]').href, uri);
    const id = chapterUrl.searchParams.get('content_id');
    const u0 = chapterUrl.pathname.startsWith('/reader/sample') ? 1 : 0;
    return {
        id: `/bib/speedreader/?cid=${id.slice(1, 11)}_jp_${id.slice(11, 15)}&u0=${u0}&u1=0`,
        title: element.querySelector('.title_details_title_name_h2').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/title\/\d+\/$/, '#GA_this_page_title_name')
@Common.MangasNotSupported()
@Common.ChaptersMultiPageCSS('ul li:has(a[href^="/reader/"])', Common.PatternLinkGenerator('{id}?order=down&page={page}'), 0, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016452)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('cmoa', `コミックシーモア (Cmoa)`, 'https://www.cmoa.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }
}