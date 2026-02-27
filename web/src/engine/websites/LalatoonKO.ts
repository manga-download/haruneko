import { Tags } from '../Tags';
import icon from './Lalatoon.webp';
import * as Common from './decorators/Common';
import { ToomicsBase, WebsiteInfoExtractor } from './templates/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/kr\/webtoon\/episode\/toon\/\d+$/, 'h3[class*="episode-top__tit"]', WebsiteInfoExtractor(false))
export default class extends ToomicsBase {
    public constructor() {
        super('lalatoonko', 'Lalatoon (KO)', 'https://www.lalatoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
        this.languages = ['kr'];
        this.queryMangas = 'a[href*="/webtoon/episode/toon/"]';
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}