import { Tags } from '../Tags';
import icon from './Qiman5.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from './../platform/FetchProvider';

type APIChapters = {
    data: {
        name: string,
        link : string
    }[]
}

@Common.MangaCSS(/^{origin}\/[^.]+\.html$/, 'div.info h1.name_mh')
@Common.MangasMultiPageCSS('/category/tags/6/page/{page}', 'div.item p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('qiman5', `奇漫屋 (Qiman5)`, 'https://qiman2.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = manga.Identifier.match(/\/(\d+)\.html/)[1];
        const { data } = await FetchJSON<APIChapters>(new Request(new URL(`/index.php/api/comic/chapter?mid=${mangaId}`, this.URI)));
        return data.map(chapter => new Chapter(this, manga, chapter.link, chapter.name.trim())).distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageJS.call(this, chapter, `decodeURIComponent(authCrypt.decode(DATA, 'qiman2')).split(',');`, 500);
        return pages.map(page => new Page(this, chapter, page.Link, { Referer: this.URI.href }));
    }

}