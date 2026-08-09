import { Tags } from '../Tags';
import icon from './ElevenToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

function ChapterExtractor(element: HTMLElement, uri: URL) {
    const link = new URL(element.getAttribute('onclick').split('\'').at(1), uri);
    return {
        id: link.pathname + link.search,
        title: element.querySelector<HTMLDivElement>('div.episode-title').innerText.trim()
    };
}

@Common.MangaCSS(/^https?:\/\/www\.11toon\d*\.com\/bbs\/board\.php\?bo_table=toons&stx=[^/]+/, '#cover-info h2', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('ul.homelist li[data-id] a', Common.PatternLinkGenerator('/bbs/board.php?bo_table=toon_c&type=upd&page={page}'), 0,
    anchor => ({ id: anchor.pathname + anchor.search, title: anchor.querySelector<HTMLSpanElement>('.homelist-title span').textContent.trim() }))
@Common.ChaptersMultiPageCSS('ul#comic-episode-list li button.episode', Common.PatternLinkGenerator('{id}&page={page}'), 0, ChapterExtractor)
@Common.PagesSinglePageJS('img_list', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('11toon', '11toon', 'https://www.11toon.com', Tags.Language.Korean, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(new URL(this.URI)), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}