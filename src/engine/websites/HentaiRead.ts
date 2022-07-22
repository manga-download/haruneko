import { Tags } from '../Tags';
import icon from './HentaiRead.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import type { MediaContainer } from '../providers/MediaPlugin';

@Madara.MangaCSS(/^https?:\/\/hentairead\.com\/hentai\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentairead', 'HentaiRead', 'https://hentairead.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageAJAXv1.call(this, manga);
        return chapters.map(chapter => new Chapter(this, chapter.Parent as MediaContainer<Chapter>, chapter.Identifier + '?style=list', chapter.Title));
    }
}