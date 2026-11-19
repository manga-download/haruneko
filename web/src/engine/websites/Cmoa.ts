import { Tags } from '../Tags';
import icon from './Cmoa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchWindowScript } from '../platform/FetchProvider';

function ChapterExtractor(element: HTMLElement) {
    const chapterElement = element.querySelector<HTMLAnchorElement>('a[href^="/reader/"]');
    const titleElement = element.querySelector<HTMLElement>('.title_details_title_name_h2');
    return Common.WebsiteInfoExtractor({ queryBloat: 'span', includeSearch: true }).call(this, titleElement, new URL(chapterElement.href));
}

@Common.MangaCSS(/^{origin}\/title\/\d+\/$/, 'section.brCramb span:has(a[href*="/title/"])')
@Common.MangasMultiPageCSS('ul li.search_result_box div.search_result_box_right a.title', Common.PatternLinkGenerator('/search/result?page={page}'))
@Common.ChaptersMultiPageCSS('ul li:has(a[href^="/reader/"])', Common.PatternLinkGenerator('{id}?order=down&page={page}'), 0, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('cmoa', `コミックシーモア (Cmoa)`, 'https://www.cmoa.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `cookieStore.set('R18user', '1')`);
    }
}