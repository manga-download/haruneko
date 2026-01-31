import { Tags } from '../Tags';
import icon from './Mwku.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIPages = {
    data: {
        images: {
            url: string
        }[];
    }
};

const primaryDomain = 'www.mwbu.cc';
const patternAliasDomains = [
    primaryDomain,
    'www.mwpu.cc',
].join('|').replaceAll('.', '\\.');

@Common.MangaCSS(new RegExp(`^https?://(${patternAliasDomains})/comic/\\d+$`), 'h2.comic-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#dataList div.item a', Common.PatternLinkGenerator('/cate/{page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLDivElement>('div.title').textContent.trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('#chapter-grid-container > a.chapter-item', undefined,
    anchor => ({ id: anchor.pathname, title: anchor.dataset.title.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mwku', 'Mwku', `https://${primaryDomain}`, Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //some chapters got different lazy loading, some are multipaged. Using API for reliabillity;
        const CDN = await FetchWindowScript<string>(new Request(new URL(chapter.Identifier, this.URI)), 'CURRENT_IMAGE_SOURCE');
        const requestUrl = new URL(`./api/comic/image/${chapter.Identifier.split('/').at(-1)}?page=1&page_size=9999`, this.URI);
        requestUrl.searchParams.set('image_source', CDN);
        const { data: { images } } = await FetchJSON<APIPages>(new Request(requestUrl));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, CDN)));
    };
}