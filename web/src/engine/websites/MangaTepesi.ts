import { Tags } from '../Tags';
import icon from './MangaTepesi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('div.manga-card-mName').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('div.manga-chapters-item-title').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\//, 'div.about-manga-info h2')
@Common.MangasSinglePageCSS('/mangalistesi', 'article.manga-card > a', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div#manga-chapters-item-list a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('img.read-manga-image:not([style])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatepesi', `MangaTepesi`, 'https://mangatepesi.com', Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

}
