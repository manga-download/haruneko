import { Tags } from '../Tags';
import icon from './MangaAy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
   page_array.map(page => server+dataurl+"/"+page);
`;

function MangaInfoExtractor(element: HTMLElement) {
    const id = element.querySelector('a').pathname;
    const title = element.querySelector('h3.item-name').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/\d+/, 'div.card-body h4')
@Common.MangasMultiPageCSS('/seriler/{page}', 'div.ecommerce-card', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.table-responsive a[title]')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaay', `Manga Ay`, 'https://manga-ay.com', Tags.Language.Turkish, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
