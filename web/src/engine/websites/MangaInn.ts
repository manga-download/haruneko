import { Tags } from '../Tags';
import icon from './MangaInn.webp';
import { DecoratableMangaScraper, type Manga, type MangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

//This website is literally a clone of MangaDoom

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/all-pages';
    const title = anchor.querySelector('span.val').textContent.replace(/\s*-/, '').trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/www\.mangainn\.net/, 'h5.widget-heading')
@Common.ChaptersSinglePageCSS('div#chapter_list ul.chapter-list li a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div.inner-page img.img-responsive')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangainn', `MangaInn`, 'https://www.mangainn.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const paths = [''].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const path of paths) {
            mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga-list/' + path, 'div.content ul.manga-list li a.manga-info-qtip'));
        }
        return mangalist;
    }

}