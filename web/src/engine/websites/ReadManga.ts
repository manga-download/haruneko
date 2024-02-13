import { Tags } from '../Tags';
import icon from './ReadManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pagesScript = `
    rm_h.pics.map(picture => {
        const url = new URL(picture.url)
        url.search = '';
        return url.href;
    });
`;

@Common.MangaCSS(/^{origin}/, 'h1.names span.name')
@Common.MangasMultiPageCSS('/list?offset={page}', 'div.tile div.desc h3 a', 0, 70, 0)
@Common.ChaptersSinglePageCSS('tr.item-row a.chapter-link')
@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmanga', `ReadManga`, 'https://readmanga.live', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}