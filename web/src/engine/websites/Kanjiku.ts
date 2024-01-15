import { Tags } from '../Tags';
import icon from './Kanjiku.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname.replace(/.$/, '0');
    const title = anchor.text.trim();
    return { id, title };
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('p.manga_title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}/, 'h1.manga_page_title')
@Common.MangasSinglePageCSS('/mangas/', 'a.manga_box', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.tab1 div.manga_overview_box a.latest_ch_number', ChapterExtractor)
@Common.PagesSinglePageCSS('div.container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kanjiku', `Kanjiku`, 'https://kanjiku.net', Tags.Language.German, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('clicked', 'true')`);
    }

    public override get Icon() {
        return icon;
    }
}