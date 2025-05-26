import { Tags } from '../Tags';
import icon from './BacaManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'h1.entry-title')
@MangaStream.MangasSinglePageCSS('div.cpp div.daftarkartun div.jdlbar ul li a.tip', '/daftar-manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@Common.PagesSinglePageCSS('div.img-landmine div#chimg-auh img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacamanga', 'BacaManga', 'https://komikindo.bz', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}