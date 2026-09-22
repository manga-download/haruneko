import { Tags } from '../Tags';
import icon from './HotComics.webp';
import * as Common from './decorators/Common';
import { queryMangaTitle, ToomicsBase, WebsiteInfoExtractor } from './templates/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[a-z]+\/[^/]+\/[^/]+\.html/, queryMangaTitle, WebsiteInfoExtractor)
export default class extends ToomicsBase {
    public constructor() {
        super('hotcomics', `HotComics`, 'https://hotcomics.io', Tags.Language.English, Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetLanguages(['en', 'de'])
            .WithMangasPath('/{language}/ranking')
            .WithChapterUrlPattern(/\/[a-z]{2}\/[^/]+\/[^/]+\.html/);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), 'window.cookieStore.set("hc_vfs", "Y");');//allow +18 content
    }
}