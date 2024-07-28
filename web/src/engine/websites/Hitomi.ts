import { Tags } from '../Tags';
import icon from './Hitomi.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise ( resolve => {
        resolve( galleryinfo.files.map(file => url_from_url_from_hash(galleryid, file, 'webp', undefined, 'a')));
    });
`;

@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hitomi', `Hitomi`, 'https://hitomi.la', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+/[^.]+-\\d+.html(#\\d*)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const title = await FetchWindowScript<string>(new Request(url), 'document.querySelector("h1#gallery-brand a").text.trim();', 1500);
        return new Manga(this, provider, new URL(url).pathname, title.trim());
    }

}