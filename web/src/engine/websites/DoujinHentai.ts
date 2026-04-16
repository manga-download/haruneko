import { Tags } from '../Tags';
import icon from './DoujinHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga-hentai\/[^/]+$/, 'nav ol li:last-of-type')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#manga-list-container a.block', Common.PatternLinkGenerator('/lista-manga-hentai?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section div.container div.grid a.text-lg.font-bold', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.textContent.replace(/^\s*[Ll]eer\s*([Cc]omic|[Dd]oujin|[Gg]aleria|[Mm]anga)?\s*/, '').trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div#vertical-pages-container img')].map(img => img.src)`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujinhentai', 'DoujinHentai', 'https://doujinhentai.net', Tags.Media.Manga, Tags.Language.Spanish, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('readerMode', 'vertical')`, 2500);
    }
}