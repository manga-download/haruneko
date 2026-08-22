import { Tags } from '../Tags';
import icon from './DoujinLC.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/doujin\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(`[
    ...document.querySelectorAll('#readerarea img, .reading-content img')
].map(image => image.dataset.src || image.dataset.lazySrc || image.src).filter(link => link && !link.startsWith('data:'))`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('doujinlc', 'Doujin-LC', 'https://doujin-lc.net', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
