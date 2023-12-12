import { Tags } from '../Tags';
import icon from './YoungJump.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchJSON, FetchRequest } from '../FetchProvider';

type APIMagazine = {
    url: string,
    issue: string,
    number: string
}

//@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'h1.detail-header-title, h1.detailv2-outline-title')
@Common.ChaptersUniqueFromManga()
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('youngjump', `ヤングジャンプ / ウルトラジャンプ (young jump/ultra jump)`, 'https://www.youngjump.world', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(new URL('/yj-rest-apis/getBookInfo.php', this.URI).href);
        const data = await FetchJSON<APIMagazine[]>(request);
        return data.map(magazine => new Manga(this, provider, magazine.url, `${magazine.issue} - ${magazine.number}`.trim()));

    }

}