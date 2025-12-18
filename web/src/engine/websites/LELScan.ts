import { Tags } from '../Tags';
import icon from './LELScan.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/lecture[^/]+$/, 'meta[name="lelscan"]')
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/', 'div.outil_lecture ul li a', anchor => ({ id: anchor.pathname, title: anchor.title.replace(/lecture en ligne/, '').trim() }))
@Common.ChaptersSinglePageCSS<HTMLOptionElement>('div#header-image form select:first-of-type option', undefined, option => ({ id: new URL(option.value).pathname, title: option.text.trim() }))
@Common.ImageAjaxFromHTML('div#image img')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscan', `LELScan`, 'https://lelscans.net', Tags.Language.French, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div#navigation a');
        return pages.filter(element => parseInt(element.text.trim()))
            .map(page => new Page(this, chapter, new URL(page.pathname, this.URI)));
    }
}