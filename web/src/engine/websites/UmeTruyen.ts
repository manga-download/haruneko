import { Tags } from '../Tags';
import icon from './UmeTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('/?page={page}', 'div.post-title h3 a')
@Common.ChaptersSinglePageCSS('li.wp-manga-chapter > a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('umetruyen', 'UmeTruyen', 'https://umetruyenvip.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}