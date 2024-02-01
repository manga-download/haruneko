import { Tags } from '../Tags';
import icon from './MangaArab.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/\d+\/?$/, '0/allpages'),
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div.titlecontainer div.main', Common.ElementLabelExtractor('.EnglishName'))
@Common.MangasMultiPageCSS('/manga/page:{page}', 'div.mangacontainer a.manga:nth-of-type(3)')
@Common.ChaptersSinglePageCSS('div.indexcontainer ul.new-manga-chapters li a.chapter', ChapterExtractor)
@Common.PagesSinglePageCSS('div#showchaptercontainer img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaarab', `مانجا العرب (Manga Al-arab)`, 'https://manga.ae', Tags.Language.Arabic, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}