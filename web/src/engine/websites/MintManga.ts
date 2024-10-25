import { Tags } from '../Tags';
import icon from './MintManga.webp';
import { DecoratableMangaScraper} from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReadM from './decorators/ReadMangaLive';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+$/, ReadM.queryMangaTitle)
@Common.MangasMultiPageCSS(ReadM.pathMangas, ReadM.queryMangas, 0, ReadM.pageMangaOffset, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(ReadM.chapterScript, 500)
@ReadM.PagesSinglePageJS()
@ReadM.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mintmanga', `MintManga`, 'https://24.mintmanga.one', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation );
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

}