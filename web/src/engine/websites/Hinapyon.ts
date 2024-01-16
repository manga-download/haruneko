import { Tags } from '../Tags';
import icon from './Hinapyon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div#infoarea div.post-body h1.entry-title')
@MangaStream.MangasSinglePageCSS('div#container div.listpst ul li a', '/list-doujin/?list')
@MangaStream.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a')
@Common.PagesSinglePageCSS('div.reader-area img[src]:not([src=""])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hinapyon', 'Hinapyon', 'https://hinapyon.top', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}