import { Tags } from '../Tags';
import icon from './YoungJump.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { SBVersion } from './decorators/SpeedBinb';

type APIMagazine = {
    url: string,
    issue: string,
    number: string
}

@Common.ChaptersUniqueFromManga()
@SpeedBinb.PagesSinglePageAjax(SBVersion.v016201, true)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('youngjump', `ヤングジャンプ / ウルトラジャンプ (young jump/ultra jump)`, 'https://www.youngjump.world', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https:\/\/www\.youngjump\.world\/reader\/reader.html\?/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangatitle = await FetchWindowScript<string>(new Request(url), 'document.title', 3000);
        const uri = new URL(url);
        return new Manga(this, provider, uri.pathname + uri.search, mangatitle.trim());

    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIMagazine[]>(new Request(new URL('/yj-rest-apis/getBookInfo.php', this.URI)));
        return data.map(magazine => new Manga(this, provider, magazine.url, `${magazine.issue} - ${magazine.number}`.trim()));
    }
}