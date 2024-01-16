import { Tags } from '../Tags';
import icon from './Gntai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/mangas-hentai\/[^/]+\/$/, 'main header.entry-header h1')
@Common.MangasMultiPageCSS('/page/{page}/', 'main article div.chapter-thumb > a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gntai', `GNTAI`, 'https://www.gntai.net', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const regex = /['"]page_image['"]\s*:\s*['"]([^'"]+)['"]/g;
        const url = new URL(chapter.Identifier, this.URI);
        const request = new Request(url.href);
        const pages = await FetchRegex(request, regex);
        return pages.map(image => new Page(this, chapter, new URL(image)));

    }
}