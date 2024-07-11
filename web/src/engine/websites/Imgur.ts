import { Tags } from '../Tags';
import icon from './Imgur.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise(resolve => {
        const jsonData = JSON.parse(postDataJSON);
        resolve( jsonData.media.map(image => image.url));
    });
`;

function MangaScript(): Promise<string> {
    return new Promise(resolve => {
        const jsonData = JSON.parse(window['postDataJSON']);
        resolve(jsonData.title);
    });
}

@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imgur', `Imgur`, 'https://imgur.com', Tags.Media.Comic, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https:\/\/imgur\.com\/gallery\/[^/]+$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const id = new URL(url).pathname;
        const title = await FetchWindowScript<string>(new Request(url), MangaScript);
        return new Manga(this, provider, id, title.trim());
    }
}