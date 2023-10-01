import { Tags } from '../Tags';
import icon from './ReadMNG.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.postDetail').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/www\.readmng\.com\/[^/]+$/, 'div.titleArea > h1')
@Common.MangasMultiPageCSS('/manga-list/{page}?', '.mangaSliderCard a', 1,1,0, MangaExtractor)
@Common.ChaptersSinglePageCSS('div#chapters-tabContent div.checkBoxCard a.chnumber', Common.AnchorInfoExtractor(false, 'i'))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmng', 'ReadMangaToday', 'https://www.readmng.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}