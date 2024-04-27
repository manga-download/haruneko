import { Tags } from '../Tags';
import icon from './ComicTop.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';

type JSONImages = {
    [id: number]: {
        image: string
    }
}
function ChapterExtractor(this: MangaScraper, anchor: HTMLAnchorElement) {
    const chapterUrl = new URL(anchor.pathname + anchor.search, this.URI);
    chapterUrl.searchParams.delete('t');
    return {
        id: chapterUrl.pathname + chapterUrl.search,
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.infox h1.entry-title')
@Common.MangasMultiPageCSS('/manga-list/page/{page}/', 'div.animepost div.animposx a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapter_list ul li a[title]', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comictop', 'Comic Top', 'https://comic-top.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        chapterUrl.searchParams.set('t', Math.floor(Date.now() / 1000).toString());
        const dom = await FetchHTML(new Request(chapterUrl));
        const files: JSONImages = JSON.parse(dom.documentElement.innerHTML.match(/var\s*chapter\s*=\s({.*}});/m)[1]);
        return Object.values(files).map(file => new Page(this, chapter, new URL(file.image, this.URI)));
    }
}