import { Tags } from '../Tags';
import icon from './LetheScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/bolum-sonu/])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lethescans', 'Lethe Scans', 'https://www.lethescans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}