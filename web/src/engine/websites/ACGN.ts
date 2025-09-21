import { Tags } from '../Tags';
import icon from './ACGN.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function PageExtractor(element: HTMLDivElement) {
    return element.getAttribute('_src');
}

@Common.MangaCSS(/^{origin}\/manhua-[^/]+\.htm$/, 'div#breadcrumb h1')
@Common.ChaptersSinglePageCSS('div#comic_chapter ul li a')
@Common.PagesSinglePageCSS('div#pic_list div.pic', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('acgn', '動漫戲說(ACGN.cc) - 免費線上漫畫,遊戲', 'https://comic.acgn.cc', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList: Manga[] = [];
        for (let category = 1; category <= 34; category++) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'ul#display div.list_r a', Common.PatternLinkGenerator(`/cate-${category}.htm?page={page}`));
            mangasList.push(...mangas);
        }
        return mangasList.distinct();
    }
}