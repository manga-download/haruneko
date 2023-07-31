import { Tags } from '../Tags';
import icon from './Tempestfansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return { id: anchor.pathname, title: anchor.title };
}

@MangaStream.MangaCSS(/^https?:\/\/tempestfansub\.com\/manga\/[^/]+\/$/)
@Common.MangasMultiPageCSS('/manga/?page={page}', 'div.bs div.bsx > a',1,1,0,MangaExtractor )
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tempestfansub', 'Tempestfansub', 'https://tempestfansub.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}