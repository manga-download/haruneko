import { Tags } from '../Tags';
import icon from './TraduccionesAmistosas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(element: HTMLElement) {
    const id = element.querySelector<HTMLAnchorElement>('a.action__viewer').pathname;
    const title = element.querySelector<HTMLDivElement>('h4.chapter__title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/l\/[^/]+$/, 'div.manga__title h2')
@Common.MangasMultiPageCSS('/biblioteca?page={page}', 'div.manga__item .manga__title a.manga__link')
@Common.ChaptersSinglePageCSS('div.chapter__item', ChapterExtractor)
@Common.PagesSinglePageCSS('div.reader__item img[data-src]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('traduccionesamistosas', 'Traducciones Amistosas', 'https://traduccionesamistosas.eyudud.net', Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
