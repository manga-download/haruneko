import { Tags } from '../Tags';
import icon from './MangaBuff.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.manga__name')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.cards a.cards__item', 1, 1, 0, (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.querySelector('div.cards__name').textContent.trim() }))
@Common.ChaptersSinglePageCSS('div.chapters__list a.chapters__item', (anchor: HTMLAnchorElement) => ({ id: anchor.pathname, title: anchor.dataset.chapter.trim() }))
@Common.PagesSinglePageCSS('div.reader__item img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabuff', 'MangaBuff', 'https://mangabuff.ru', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Russian, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}