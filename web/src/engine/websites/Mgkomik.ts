import { Tags } from '../Tags';
import icon from './Mgkomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'h1#mangaTitle')
@Common.MangasMultiPageCSS('div.manga-card div.card-info a.manga-title', Common.PatternLinkGenerator('/komik/?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul#chapterList li.chapter-list-item a.chapter-link', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('.chapter-number').textContent.trim() }))
@Common.PagesSinglePageCSS('div#readingContent img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mgkomik', 'MGKOMIK', 'https://web.mgkomik.cc', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}