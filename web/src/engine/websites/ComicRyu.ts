import { Tags } from '../Tags';
import icon from './ComicRyu.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

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

@Common.MangasSinglePagesCSS(['シリーズ一覧-連載中', '完結作品', 'https://unicorn.comic-ryu.jp/シリーズ一覧-連載中/'], 'ul.m-series-list li a.m-list-sakuhin-list-item-link', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('a.sakuhin-episode-link', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('figure.wp-block-image img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicryu', `COMICリュウ`, 'https://www.comic-ryu.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https:\/\/(www|unicorn)\.comic-ryu\.jp\/series\/[^/]+\/$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = (await FetchCSS<HTMLHeadingElement>(new Request(new URL(url)), 'article.sakuhin-article h1.sakuhin-article-title')).shift().textContent.trim();
        return new Manga(this, provider, url, title);
    }
}