import { Tags } from '../Tags';
import icon from './MangaDenizi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaReader from './templates/MangaReaderCMS';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(element: HTMLHeadingElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a:last-of-type').pathname,
        title: element.innerText.replace(' - Bölüm', 'Bölüm').replace(/:\s*$/, '').trim(),
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryManga)
@Common.MangasSinglePagesCSS([ MangaReader.patternMangas ], MangaReader.queryMangas)
@Common.ChaptersSinglePageCSS('ul li h5', ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadenizi', 'Manga Denizi', 'https://www.mangadenizi.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}