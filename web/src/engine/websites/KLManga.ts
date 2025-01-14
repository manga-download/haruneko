import { Tags } from '../Tags';
import icon from './KLManga.webp';
import * as Common from './decorators/Common';
import { FlatManga, MangaExtractor, pageScript, pathSinglePageManga, queryMangas } from './templates/FlatManga';

@Common.MangasSinglePagesCSS([pathSinglePageManga], queryMangas, MangaExtractor)
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('ul a.chapter')].map(chapter => { return {id: chapter.pathname, title : chapter.title.trim()};})`, 1500)
@Common.PagesSinglePageJS(pageScript, 1500)
export default class extends FlatManga {

    public constructor() {
        super('klmanga', 'KLManga', 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}