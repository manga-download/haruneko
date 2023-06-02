import { Tags } from '../../Tags';
import icon from './ManhwasMen.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as Madara from '../decorators/WordPressMadara';

@Common.MangaCSS(/^https?:\/\/manhwas\.men\/manga\/[^/]+$/, 'div.wp-manga div.post-title h1')
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.series-box a')
@Common.ChaptersSinglePageCSS('li.wp-manga-chapter a', Common.AnchorInfoExtractor(false, 'span'))
@Madara.PagesSinglePageCSS('div#chapter_imgs img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasmen', `Manhwas Men`, 'https://manhwas.men', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
