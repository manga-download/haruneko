import { Tags } from '../Tags';
import icon from './ConstellarScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS('[...document.querySelectorAll("div#reader_area img[src]")].map(image => image.getAttribute("src"))', 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('constellarscans', 'Constellar Scans', 'https://constellarcomic.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}