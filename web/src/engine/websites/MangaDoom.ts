import { Tags } from '../Tags';
import icon from './MangaDoom.webp';
import { DecoratableMangaScraper, type Manga, type MangaScraper, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/all-pages';
    const title = anchor.querySelector('span.val').textContent.replace(/\s*-/, '').trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/www\.mngdoom\.com/, 'h5.widget-heading')
@Common.ChaptersSinglePageCSS('div#chapter_list ul.chapter-list li a', ChapterInfoExtractor )
@Common.PagesSinglePageCSS('div.inner-page img.img-responsive')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadoom', `MangaDoom`, 'https://www.mngdoom.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const paths = [''].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const path of paths) {
            mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga-directory/'+path, 'div.content ul.manga-list li a.manga-info-qtip'));
        }
        return mangalist;
    }

}
