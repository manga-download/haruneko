import { Tags } from '../Tags';
import icon from './MirrorKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/Man(hwa|ga|hua)\/[^/]+$/, 'ol li:last-of-type')
@Common.MangasSinglePageCSS('/list-komik', ZManga.queryManga)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/pasang-iklan(\d)?\.png$/], `[...document.querySelectorAll('div#readerarea img.imglist')].map(image => (image.dataset.realSrc ?? image.src));`)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mirrorkomik', 'MirrorKomik', 'https://mirrorkomik.info', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}