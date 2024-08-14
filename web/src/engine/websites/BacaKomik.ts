import { Tags } from '../Tags';
import icon from './BacaKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.cpp div.daftarkartun div.jdlbar ul li a.tip', '/daftar-komik/?list')
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div#anjay_ini_id_kh img:not(noscript img)')
@Common.ImageElement(false)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomik', 'BacaKomik', 'https://bacakomik.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}