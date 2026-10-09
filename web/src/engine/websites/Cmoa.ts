import { Tags } from '../Tags';
import icon from './Cmoa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function ChapterExtractor(element: HTMLElement) {
    const chapterElement = element.querySelector<HTMLAnchorElement>('a[href^="/reader/"]');
    return {
        id: chapterElement.pathname + chapterElement.search,
        title: element.querySelector('.title_details_title_name_h2').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/title\/\d+\/$/, '#GA_this_page_title_name')
@Common.MangasNotSupported()
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
}