import { Tags } from '../Tags';
import icon from './KingOfManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/comics\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/comics/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/start-ks\.jpg$/i, /end-ks\.jpg$/i])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kingofmanga', 'KingOfManga', 'https://myshojo.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}