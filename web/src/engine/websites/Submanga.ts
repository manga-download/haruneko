import { Tags } from '../Tags';
import icon from './Submanga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h2.manga-name')
@Common.MangasMultiPageCSS('/filterList?page={page}&sortBy=name', 'div.manga-detail .manga-name a')
@Common.ChaptersSinglePageCSS('ul#en-chapters li a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div#all img.img-responsive')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('submanga', `Submanga`, 'https://submanga.bio', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}