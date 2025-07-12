import { Tags } from '../Tags';
import icon from './HentaiNexus.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/view\/\d+$/, 'div.column h1.title')
@Common.MangasMultiPageCSS('/page/{page}', 'div.column > a',)
@Common.PagesSinglePageJS(`pageData.map(page => page.image);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('hentainexus', 'HentaiNexus', 'https://hentainexus.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [ new Chapter(this, manga, manga.Identifier.replace('/view/', '/read/'), manga.Title) ];
    }
}