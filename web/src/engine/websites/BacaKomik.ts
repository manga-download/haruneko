import { Tags } from '../Tags';
import icon from './BacaKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/bacakomik\.me\/komik\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.cpp div.daftarkartun div.jdlbar ul li a.tip', '/daftar-manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div#imagenya-xiaomeng img')
@Common.ImageElement(false)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomik', 'BacaKomik', 'https://bacakomik.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}