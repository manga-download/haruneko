import { Tags } from '../Tags';
import icon from './ManhwaFullNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, Zbulu.queryManga, Zbulu.MangaLabelExtractor)
@Zbulu.MangasMultiPageCSS('/comic-list/page-{page}/')
@Zbulu.ChaptersMultiPageCSS(Zbulu.chapterPath, 'div#chapterList div.items-chapters a')
@Common.PagesSinglePageCSS(Zbulu.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafullnet', `ManhwaFull(.Net)`, 'https://manhwafull.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}