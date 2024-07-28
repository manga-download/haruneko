import { Tags } from '../Tags';
import icon from './iqiyi.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './templates/MH';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    data: {
        episodes: {
            episodeId: number,
            episodeOrder: number,
            episodeTitle : string
        }[]
    }

}
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.nextElementSibling.textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manhua\/detail_[^/]+\.html$/, '.detail-tit h1')
@Common.MangasMultiPageCSS('/manhua/category/%E5%85%A8%E9%83%A8_-1_-1_9_{page}', 'ul.cartoon-hot-ul li.cartoon-hot-list a.cartoon-cover', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageCSS('ul.main-container li.main-item img', MH.PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('iqiyi', `iqiyi`, 'https://www.iqiyi.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const manhuaId = new URL(manga.Identifier, this.URI).href.match(/_(([a-z]|[0-9])*)/)[1];
        const requestChaps = new Request(new URL(`/manhua/catalog/${manhuaId}/`, this.URI));
        const { data: { episodes } } = await FetchJSON<APIChapters>(requestChaps);
        return episodes.map(element => new Chapter(this, manga, `/manhua/reader/${manhuaId}_${element.episodeId}.html`, [element.episodeOrder, element.episodeTitle.trim()].join(' ')));
    }

}