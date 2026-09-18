import { Tags } from '../Tags';
import icon from './Daysneo.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/works\/[^/]+\.html$/, 'p.f150.b')
@Common.MangasMultiPageCSS('ul.tile li strong.f130 a', Common.PatternLinkGenerator('/search/?page_num={page}'))
@Common.ChaptersSinglePageCSS('ul.ul01 li strong.f130 a', undefined, undefined, true)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('daysneo', `Daysneo`, 'https://daysneo.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /src="([^"]*)">'\);/g);
        return data.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}