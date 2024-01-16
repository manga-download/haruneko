import { Tags } from '../Tags';
import icon from './NHentaiCom.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    title: string,
    slug:string
}

type APIPages = {
    images: {
        source_url: string
    }[]
}

@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhentaicom', 'NHentaiCom', 'https://nhentai.com', Tags.Media.Manga, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.split('/').pop();
        const request = new Request(new URL(`/api/comics/${slug}`, this.URI).href);
        const data = await FetchJSON<APIManga>(request);
        return new Manga(this, provider, data.slug, data.title.trim());
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/comics/${chapter.Identifier}/images`, this.URI).href);
        const { images } = await FetchJSON<APIPages>(request);
        return images.map(image => new Page(this, chapter, new URL(image.source_url)));
    }
}