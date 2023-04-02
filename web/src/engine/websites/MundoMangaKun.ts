import { Tags } from '../Tags';
import icon from './MundoMangaKun.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mundomangakun\.com\.br/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([], 'ts_reader.params.sources[0].images', 500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mundomangakun', `Mundo Mangá-Kun`, 'https://mundomangakun.com.br', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}