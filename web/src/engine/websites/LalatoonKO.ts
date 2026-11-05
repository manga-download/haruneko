import { Tags } from '../Tags';
import icon from './Lalatoon.webp';
import * as Common from './decorators/Common';
import { queryMangaTitle, ToomicsBase } from './templates/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/kr\/webtoon\/episode\/toon\/\d+$/, queryMangaTitle)
export default class extends ToomicsBase {
    public constructor() {
        super('lalatoonko', 'Lalatoon (Korean)', 'https://www.lalatoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetLanguages(['kr']);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }
}