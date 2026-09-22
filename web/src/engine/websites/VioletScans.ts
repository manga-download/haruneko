import { Tags } from '../Tags';
import icon from './VioletScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/comics\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/comics/list-mode/')
@MangaStream.ChaptersSinglePageCSS('#chapterlist li a[href]')
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('violetscans', 'Violet Scans', 'https://violetscans.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
