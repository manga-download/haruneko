import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchRequest, FetchWindowScript } from '../FetchProvider';

@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS([ /ENDING-PAGE/i ], 'div#readerarea p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuratoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        this.URI.href = await FetchWindowScript<string>(request, 'window.location.origin');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public override async FetchManga(this: DecoratableMangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
        return MangaStream.FetchMangaCSS.call(this, provider, url);
    }
}