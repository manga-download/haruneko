import { Tags } from '../Tags';
import icon from './Doujins.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ImageExtractor(node: HTMLImageElement) {
    return node.dataset.file;
}

@Common.MangaCSS(/^https?:\/\/doujins\.com\/[^/]+/, 'head title')
@Common.MangasNotSupported()
// TODO: Consider using decorator Common.ChaptersUniqueFromManga(...)
@Common.PagesSinglePageCSS('img.doujin', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujins', `Doujins`, 'https://doujins.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }
}