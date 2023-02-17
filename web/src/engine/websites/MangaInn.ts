import { Tags } from '../Tags';
import icon from './MangaInn.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from './../FetchProvider';

//This website is literally a clone of MangaDoom

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/all-pages';
    const title = anchor.querySelector('span.val').textContent.replace(/\s*-/, '').trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/www\.mangainn\.net/, 'h5.widget-heading')
@Common.ChaptersSinglePageCSS('div#chapter_list ul.chapter-list li a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div.inner-page img.img-responsive')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangainn', `MangaInn`, 'https://www.mangainn.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const paths = [''].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const path of paths) {
            mangalist.push(...await this.getMangasFromCategory(path, provider));
        }
        return mangalist;
    }

    private async getMangasFromCategory(path: string, provider: MangaPlugin) {
        const url = new URL('/manga-list/' + path, this.URI);
        const request = new FetchRequest(url.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.content ul.manga-list li a.manga-info-qtip');
        return data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
    }

}