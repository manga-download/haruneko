import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

function GenerateRandomEndPoint(length: number, suffix: string): string {
    const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomEndpoint = '';
    for (let o = 0; o < length; o++) randomEndpoint += r.charAt(Math.floor(Math.random() * r.length));
    return randomEndpoint + suffix;
}

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageAJAX(GenerateRandomEndPoint(25, '.lstc?slug='), 'dataL', 'a.chapter[title]')
@FlatManga.PagesSinglePageAJAX(GenerateRandomEndPoint(30, '.iog?cid='), 'img.chapter-img[alt*="Page"]', [/olimposcan/] )
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klmanga', `KLManga`, 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}