import { Tags } from '../Tags';
import icon from './Kakaopage.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    result: {
        has_next: boolean;
        list: {
            cursor_index: number;
            item: {
                product_id: number;
                title: string;
            }
        }[];
    };
};

type APIPages = {
    viewerData: {
        imageDownloadData: {
            files: {
                secureUrl: string;
            }[];
        }
    }
};

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://bff-page.kakao.com/api/gateway/api/';

    public constructor() {
        super('kakaopage', 'Page Kakao (카카오페이지)', 'https://page.kakao.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[\\d]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname.match(/content\/(\d+)/).at(1);
        const [{ text }] = await FetchCSS<HTMLTitleElement>(new Request(url), 'title');
        return new Manga(this, provider, id, text.split(' - ').at(0).trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { result: { list } } = await FetchJSON<APIChapters>(new Request(new URL(`./v2/content/product/list?series_id=${manga.Identifier}&cursor_index=0&window_size=9999`, this.apiUrl)));
        return list.map(({ item: { product_id: productId, title } }) => new Chapter(this, manga, `${productId}`, title.replace(manga.Title, '').trim() || title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { viewerData: { imageDownloadData: { files } } } = await FetchJSON<APIPages>(new Request(new URL(`./v1/viewer/data?series_id=${chapter.Parent.Identifier}&product_id=${chapter.Identifier}`, this.apiUrl)));
        return files.map(({ secureUrl }) => new Page(this, chapter, new URL(secureUrl)));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/content/${chapter.Parent.Identifier}/viewer/${chapter.Identifier}`, this.URI);
    }
}