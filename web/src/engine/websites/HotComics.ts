import { Tags } from '../Tags';
import icon from './HotComics.webp';
import * as Common from './decorators/Common';
import { ToomicsBase, WebsiteInfoExtractor } from './templates/ToomicsBase';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[a-z]+\/[^/]+\/[^/]+\.html$/, 'div.title_content h2.episode-title', WebsiteInfoExtractor())
export default class extends ToomicsBase {
    public constructor() {
        super('hotcomics', `HotComics`, 'https://hotcomics.me', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
        this.languages = ['en', 'de', 'jp', 'ch', 'tc', 'mx', 'es', 'it', 'por', 'fr', 'ko'];
        this.mangaPath = '/{language}/ranking';
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), 'window.cookieStore.set("hc_vfs", "Y");');//allow +18 content
    }
}