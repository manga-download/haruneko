import { Tags } from '../Tags';
import icon from './Doujins.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ImageExtractor(node: HTMLImageElement) {
    return node.dataset.file;
}

@Common.MangaCSS(/^{origin}\/[^/]+/, 'head title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('img.doujin', ImageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('doujins', `Doujins`, 'https://doujins.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}