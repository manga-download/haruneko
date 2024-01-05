import { Tags } from '../Tags';
import icon from './MangaKatana.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const queryPages = '#imgs .wrap_img img[data-src]';

const pageScript = `
    [ ...document.querySelectorAll('${queryPages}') ].map(element => element.dataset.src);
`;

@Common.MangaCSS(/^{origin}\/manga\//, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('/manga/page/{page}?filter=1', 'div#book_list div.item div.text h3.title a', 1, 1, 1500)
@Common.ChaptersSinglePageCSS('div.chapters table tbody tr td div.chapter a')
@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakatana', `MangaKatana`, 'https://mangakatana.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
