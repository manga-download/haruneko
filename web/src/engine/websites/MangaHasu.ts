import { Tags } from '../Tags';
import icon from './MangaHasu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, '.info-title h1')
@Common.MangasMultiPageCSS('/directory.html?page={page}', 'ul.list_manga li a.name-manga', 1, 1, 1000)
@Common.ChaptersSinglePageCSS('div.list-chapter table tr td.name a')
@Common.PagesSinglePageCSS('div.img-chapter div.img img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahasu', `MangaHasu`, 'https://mangahasu.me', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}