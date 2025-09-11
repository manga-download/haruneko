import { Tags } from '../Tags';
import icon from './MangaBuff.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.dataset.chapter.trim()
    };
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.cards__name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.manga__name')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.cards a.cards__item', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div.chapters__list a.chapters__item', ChapterExtractor)
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