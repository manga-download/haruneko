import { Tags } from '../../Tags';
import icon from './KissComic.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchRequest, FetchWindowScript } from '../../FetchProvider';

@Common.MangaCSS(/^{origin}\/Comic\/[^/]+$/, 'div.barContent a.bigChar')
@Common.MangasMultiPageCSS('/ComicList?page={page}', 'div.list-comic div.item a, div.item-list div.group div.col.info a')
@Common.ChaptersSinglePageCSS('div.episodeList table.listing tr td:first-of-type a, div.section ul.list li a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kisscomic', `KissComic (ReadComicOnline)`, 'https://readcomiconline.li', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI);
        url.searchParams.set('readType', '1');
        url.searchParams.set('quality', 'hq');
        const request = new FetchRequest(url.href);
        const data = await FetchWindowScript<string[]>(request, 'lstImages');
        return data.map(image => new Page(this, chapter, new URL(image)));
    }
}