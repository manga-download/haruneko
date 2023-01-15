import { Tags } from '../Tags';
import icon from './MangaBuddy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/mangabuddy\.com\/[^/]+$/, 'div.name.box h1')
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
        super('mangabuddy', 'MangaBuddy', 'https://mangabuddy.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
