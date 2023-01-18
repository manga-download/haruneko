import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

const extractor = Common.AnchorInfoExtractor(true);
@MangaStream.MangaCSS(/^https?:\/\/212\.32\.226\.234\/manga\/[^/]+\/$/, 'div#infoarea div.post-body h1.entry-title')
@Common.MangasMultiPageCSS('/komik-list/page/{page}/', '#main .relat div.animepost a', 1, 1, 0, extractor)
@MangaStream.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://212.32.226.234', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}