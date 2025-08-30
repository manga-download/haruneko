import { Tags } from '../Tags';
import icon from './Ziz.webp';
import { FetchHTML } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'title', (element) => element.textContent.split('-').at(0).trim())
@Common.MangasMultiPageCSS('/mangas/?page={page}', 'div.content-grid a', 1, 1, 0, Common.AnchorInfoExtractor(false, 'p, span'))
@Common.ChaptersSinglePageCSS('div#chapterList a.chapter-item', Common.AnchorInfoExtractor(false, 'p, span'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('drakescans', 'Ziz', 'https://www.zzizz.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const dom = await FetchHTML(request);
        const pages = this.ExtractScriptJSON<{ id: number; }[]>(dom, 'script#pages-data-json');
        const path = this.ExtractScriptJSON<{ page_api_url_base: string; }>(dom, 'script#reader-config-json').page_api_url_base;
        return pages.map(page => new Page(this, chapter, new URL(path + page.id + '/', this.URI)));
    }

    private ExtractScriptJSON<T extends JSONElement>(dom: Document, query: string): T {
        return JSON.parse(dom.querySelector<HTMLScriptElement>(query).text) as T;
    }
}