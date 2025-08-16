import { Tags } from '../Tags';
import icon from './TAADD.webp';
import * as Common from './decorators/Common';
import { MangaLabelExtractor, TAADBase, mangaPath } from './templates/TAADDBase';

@Common.MangaCSS(/^{origin}\/book\/[^/]+\.html$/, 'meta[property="og:title"]', MangaLabelExtractor)
@Common.MangasMultiPageCSS(mangaPath, 'div.clistChr ul li div.intro h2 a')
export default class extends TAADBase {
    public constructor() {
        super('taadd', `TAADD`, 'https://www.taadd.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
        this.queryChapters = 'div.chapter_list table tr td:first-of-type a';
        this.queryImages = 'img#comicpic';
        this.forcedWebpCookieValue = undefined;

    }
    public override get Icon() {
        return icon;
    }
}