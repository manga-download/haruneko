import { Tags } from '../Tags';
import icon from './LectorMangaLat.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, '[data-manga-title]', (el, uri) => ({
    id: uri.pathname,
    title: el.dataset.mangaTitle.trim()
}))
@Common.MangasMultiPageCSS('div.card-info > a', Common.PatternLinkGenerator('/comics?page={page}'))
@Common.ChaptersSinglePageCSS('div#chapters-list div[data-chapter-num]', undefined, element => ({
    id: element.querySelector('a').pathname,
    title: `Capítulo ${element.dataset.chapterNum}`
}))
@Common.PagesSinglePageCSS('div.reader-pages img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lectormangalat', 'LectorManga (.Lat)', 'https://lectormangass.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}