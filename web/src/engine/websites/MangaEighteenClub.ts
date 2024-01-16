import { Tags } from '../Tags';
import icon from './MangaEighteenClub.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('/list-manga/{page}', 'div.story_item div.mg_info div.mg_name > a' )
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18-club', `Manga18.club`, 'https://manga18.club', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const pictures = await FetchWindowScript<string[]>(request, 'window.slides_p_path', 500);
        return pictures.map(element => new Page(this, chapter, new URL(window.atob(element), this.URI)));
    }
}