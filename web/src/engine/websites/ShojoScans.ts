import { Tags } from '../Tags';
import icon from './ShojoScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span.chapternum').textContent.trim().replaceAll('\n', '').replaceAll('\t', ''),
    };
}

@Common.MangaCSS(/^{origin}\/comics\/[^/]+\/$/, 'h1.entry-title')
@MangaStream.MangasSinglePageCSS(undefined, '/comics/list-mode')
@Common.ChaptersSinglePageCSS('div#chapterlist ul li a', ChapterExtractor)
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shojoscans', 'Shojo Scans', 'https://shojoscans.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
