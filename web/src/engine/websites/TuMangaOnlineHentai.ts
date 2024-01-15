import { Tags } from '../Tags';
import icon from './TuMangaOnlineHentai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ImageExtractor(img: HTMLImageElement) {
    return new URL(img.dataset['original'] || img.src, this.URI).href;
}

@Common.MangaCSS(/^{origin}\/contents\//, 'div.panel-heading h3')
@Common.MangasMultiPageCSS('/section/all?view=list&order=alphabetic&page={page}', 'div.panel-body table.table tbody tr td.text-left a')
@Common.PagesSinglePageCSS('div#content-images img.content-image', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumangaonlinehentai', `TMOHentai`, 'https://tmohentai.com', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier.replace('/contents/', '/reader/') + '/cascade', manga.Title.trim())];
    }
}
