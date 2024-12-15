import { Tags } from '../Tags';
import icon from './HotComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Toomics from './decorators/Toomics';
import { FetchWindowScript } from '../platform/FetchProvider';

function MangaInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector(Toomics.queryMangaTitle).textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[a-z]+\/[^/]+\/[^/]+\.html$/, 'div.title_content h2.episode-title')
@Common.MangasSinglePagesCSS(['/en/weekly'], 'ul.allday li a', MangaInfoExtractor)
@Toomics.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(Toomics.queryPages, Toomics.PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('hotcomics', `HotComics`, 'https://hotcomics.me', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}