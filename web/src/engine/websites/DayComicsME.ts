import { Tags } from '../Tags';
import icon from './DayComicsME.webp';
import * as Common from './decorators/Common';
import { MangaInfoExtractor, ToomicsBase, WebsiteInfoExtractor } from './templates/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/en\/[^/]+\/[^/]+\.html$/, 'div.title_content h2.episode-title', WebsiteInfoExtractor(false))
@Common.MangasMultiPageCSS('div.list-wrap ul li a', Common.PatternLinkGenerator('/en/genres?page={page}'), 0, MangaInfoExtractor(false))

export default class extends ToomicsBase {
    public constructor() {
        super('daycomicsme', 'DayComics(.me)', 'https://daycomics.me', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), 'window.cookieStore.set("hc_vfs", "Y");');//allow +18 content
    }
}