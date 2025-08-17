import { Tags } from '../Tags';
import icon from './Komiku.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const endpoints = ['manga', 'manhua', 'manhwa'].map(genre => `/daftar-komik/?tipe=${genre}`);

function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.replace(/^komik/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'article div#Judul h1 span[itemprop="name"]', MangaLabelExtractor)
@Common.MangasSinglePagesCSS(endpoints, 'div.ls4 div.ls4j h4 a')
@Common.ChaptersSinglePageCSS('table#Daftar_Chapter td.judulseries a')
@Common.PagesSinglePageCSS('div#Baca_Komik img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiku', `Komiku`, 'https://komiku.org', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}