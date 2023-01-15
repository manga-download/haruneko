import { Tags } from '../Tags';
import icon from './Manga1001top.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/manga1001\.top\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.manga-list div.title h3 a', 1)
@Common.ChaptersSinglePageCSS('ul.chapter-list li a', Common.AnchorInfoExtractor(false, '.chapter-update'))
@Common.PagesSinglePageJS(`      new Promise(resolve => {
        let images = window.chapImages.split(',');
            resolve(images.map(image => window.mainServer+image));
        });
        ;`)
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga1001top', 'Manga1001.top', 'https://manga1001.top', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}