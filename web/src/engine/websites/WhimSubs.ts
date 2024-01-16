import { Tags } from '../Tags';
import icon from './WhimSubs.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from './../platform/FetchProvider';

type APIPages = {
    readingOrder: {
        href: string
    }[]
}

@Common.MangaCSS(/^{origin}\/r\/series\/[^/]+\/$/, '.mdc-layout-grid__cell.mdc-layout-grid__cell--span-8-desktop.mdc-layout-grid__cell--span-6-tablet h1', Common.ElementLabelExtractor('span, a'))
@Common.MangasMultiPageCSS('/r/directory/{page}/', 'div.mdc-card div.mdc-card__media-title > a')
@Common.ChaptersSinglePageCSS('ul.mdc-list li span.mdc-list-item__text > a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('whimsubs', `WhimSubs`, 'https://whimsubs.xyz', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier + 'manifest.json', this.URI).href);
        const data = await FetchJSON<APIPages>(request);
        return data.readingOrder.map(page => new Page(this, chapter, new URL(page.href)));
    }
}