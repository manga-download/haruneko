import { Tags } from '../Tags';
import icon from './RitharScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';
import { FetchRegex } from '../platform/FetchProvider';

type JSONImage = {
    path : string
}

// TODO: Check for possible revision

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'input#serieTitle', (element) => element.getAttribute('value').trim())
@Common.MangasSinglePagesCSS([ '/latest' ], 'div.grid a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, Common.AnchorInfoExtractor(true))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly mediaUrl = new URL('/storage/', this.URI);

    public constructor() {
        super('ritharscans', 'Rithar Scans', 'https://ritharscans.com', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /pages:\s(\[.*])/g);
        const pagesData: JSONImage[] = JSON.parse(data.replaceAll('&quot;', '"'));
        return pagesData.map(page => new Page(this, chapter, new URL(page.path, this.mediaUrl)));
    }
}