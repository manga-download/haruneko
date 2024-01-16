import { Tags } from '../Tags';
import icon from './ManhwaEighteen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'span.series-name')
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.series-title a')
@Common.ChaptersSinglePageCSS('ul.list-chapters a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#chapter-content img.lazy')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa18-int', `Manhwa 18 (.net)`, 'https://manhwa18.net', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}