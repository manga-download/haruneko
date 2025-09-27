import { Tags } from '../Tags';
import icon from './TencentComic.webp';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './TencentComic.DRM.js';

@Common.MangaCSS(/^{origin}\/Comic\/ComicInfo\/id\/\d+$/i, 'h2.works-intro-title')
@Common.MangasMultiPageCSS('div.ret-main ul.ret-search-list li.ret-search-item div.ret-works-info h3.ret-works-title a', Common.PatternLinkGenerator('/Comic/all/search/time/vip/1/page/{page}'))
@Common.ChaptersSinglePageCSS('.works-chapter-list.chapter-page-all li span.works-chapter-item a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm: DRMProvider = new DRMProvider();

    public constructor() {
        super('tencentcomic', 'Tencent (Comic)', 'https://ac.qq.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return pages.map(link => new Page(this, chapter, new URL(link), { Referer: this.URI.href }));
    }
}