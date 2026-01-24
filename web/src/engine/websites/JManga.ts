import { Tags } from '../Tags';
import icon from './JManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/read\/[^/]+-raw\/$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS(Liliana.queryMangas, Common.PatternLinkGenerator('/raw-manga/?p={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(Liliana.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Liliana.PagesSinglePageJS(`'/json/chapter?id=' + document.querySelector('ul.reading-list li.active').dataset.id`, 'div.iv-card img', img => img.dataset.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jmanga', 'JManga', 'https://ww3.jmanga.us', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Japanese, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin;`, 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}