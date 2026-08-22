import { Tags } from '../Tags';
import icon from './EcchiDoujin.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/doujin\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/doujin/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(`[
    ...document.querySelectorAll('#readerarea img, .reading-content img')
].map(image => image.dataset.src || image.dataset.lazySrc || image.src).filter(link => link && !link.startsWith('data:'))`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ecchidoujin', 'Ecchi-Doujin', 'https://ecchi-doujin.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
