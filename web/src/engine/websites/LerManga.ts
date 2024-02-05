import { Tags } from '../Tags';
import icon from './LerManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaLabelExTractor(anchor: HTMLAnchorElement) {
    return anchor.text.replace(/^Ler Mangá/, '').trim();
}

@Common.MangaCSS(/^{origin}\/mangas\/[^/]+\/$/, 'div.anime div.boxAnimeSobreLast h1 a', MangaLabelExTractor)
@Common.MangasMultiPageCSS('/mangas/page/{page}/', 'div.flw-item h3.film-name a' )
@Common.ChaptersSinglePageCSS('div.manga-chapters div.single-chapter a')
@Common.PagesSinglePageJS('imagens_cap')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lermanga', 'LerManga', 'https://lermanga.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}