import { Tags } from '../Tags';
import icon from './JManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/read\/[^/]+-raw\/$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('/raw-manga/?p={page}', Liliana.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters, Common.AnchorInfoExtractor(true))
@Liliana.PagesSinglePageJS(`'/json/chapter?id=' + document.querySelector('ul.reading-list li.active').dataset.id`, 'div.iv-card img', img => img.dataset.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jmanga', 'JManga', 'https://jmanga.ceo', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}