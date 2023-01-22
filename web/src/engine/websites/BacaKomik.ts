import { Tags } from '../Tags';
import icon from './BacaKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/bacakomik\.co\/komik\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.cpp div.daftarkartun div.jdlbar ul li a.tip', '/daftar-manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div.chapter-area div.chapter-content div.chapter-images img')
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomik', 'BacaKomik', 'https://bacakomik.co', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}