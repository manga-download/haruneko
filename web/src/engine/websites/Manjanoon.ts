import { Tags } from '../Tags';
import icon from './Manjanoon.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.grid div.grid h1')
@Common.MangasSinglePagesCSS(['/latest'], 'div.grid a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapters a', Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manjanoon', 'Manjanoon', 'https://manjanoon.art', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Arabic, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const realUrl = doc.documentElement.innerHTML.match(/realUrl\s*=\s*`([^$]+)/)[1];
        return [...doc.querySelectorAll<HTMLImageElement>('.myImage')].map(image => new Page(this, chapter, new URL(image.getAttribute('uid'), realUrl)));
    }

}