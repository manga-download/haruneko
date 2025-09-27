import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './ComicRyu.webp';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.href,
        title: anchor.querySelector<HTMLHeadingElement>('h1.sakuhin-article-title').textContent.trim()
    };
}
function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.href,
        title: anchor.querySelector<HTMLHeadingElement>('h1.sakuhin-episode-title').textContent.trim()
    };
}

@Common.MangaCSS<HTMLHeadingElement>(/^https:\/\/(www|unicorn)\.comic-ryu\.jp\/series\/[^/]+\/$/, 'article.sakuhin-article h1.sakuhin-article-title', (heading, uri) => ({ id: uri.href, title: heading.innerText.trim() }))
@Common.MangasMultiPageCSS('ul.m-series-list li a.m-list-sakuhin-list-item-link', Common.StaticLinkGenerator('/シリーズ一覧-連載中', '/完結作品', 'https://unicorn.comic-ryu.jp/シリーズ一覧-連載中/'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('a.sakuhin-episode-link', undefined, ChapterInfoExtractor)
@Common.PagesSinglePageCSS('figure.wp-block-image img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicryu', `COMICリュウ`, 'https://www.comic-ryu.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}