import { Tags } from '../Tags';
import icon from './JiroComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/jirocomics\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageCSS('div.post-title h3 a', 0, '/manga/?page={page}')
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jirocomics', 'Jirocomics', 'https://jirocomics.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}