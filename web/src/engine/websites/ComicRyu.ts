import { Tags } from '../Tags';
import icon from './ComicRyu.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'article.sakuhin-article h1.sakuhin-article-title')
@Common.ChaptersSinglePageCSS('a.sakuhin-episode-link')
@Common.PagesSinglePageCSS('figure.wp-block-image img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicryu', `COMICリュウ`, 'https://www.comic-ryu.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const categories = ['シリーズ一覧-連載中', '完結作品'];
        const mangasList: Manga[] = [];
        for (const category of categories) {
            const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(category, this.URI)), 'ul.m-series-list li a.m-list-sakuhin-list-item-link');
            mangasList.push(...data.map(element => new Manga(this, provider, element.pathname, element.querySelector('h1.sakuhin-article-title').textContent.trim())));
        }
        return mangasList.distinct();
    }
}