import { Tags } from '../Tags';
import icon from './WanPaMan.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIPages = {
    imageItemList: {
        fileName: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/$/, 'title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a[href*=fc2-imageviewer]', undefined, anchor => ({
    id: anchor.pathname + anchor.search,
    title: anchor.textContent.trim()
}), true)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wanpaman', `Wan-Pa Man`, 'http://galaxyheavyblow.web.fc2.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [new Manga(this, provider, this.URI.pathname, 'ワンパンマン')];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const aid = chapterUrl.searchParams.get('aid');
        const iid = chapterUrl.searchParams.get('iid');
        const basePath = `${chapterUrl.pathname}${aid}/${iid}`;
        const { imageItemList } = await FetchJSON<APIPages>(new Request(new URL(`${basePath}/metadata.json?_=${Date.now()}`, this.URI)));
        return imageItemList.map(({ fileName }) => new Page(this, chapter, new URL(`${basePath}/${fileName}`, this.URI), { Referer: this.URI.href }));
    }
}