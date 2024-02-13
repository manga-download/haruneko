import { Tags } from '../Tags';
import icon from './Migudm.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const queryPages = 'div.comicMain ul.readUl li img';
const script = `
    const images = [...document.querySelectorAll('${queryPages}')];
    images.map(image => image.dataset['src'] || image.dataset['data-src'] || image.src);
`;
@Common.MangaCSS(/^{origin}\/comic\//, 'div.inner h1.title', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/comic/list_p{page}/', 'div.classificationList ul li div.clItemRight h4.title a')
@Common.ChaptersSinglePageCSS('div.comic div#negCtSectionListBd div.titleList a.item', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(script, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('migudm', `咪咕 (Migudm)`, 'https://www.migudm.cn', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
