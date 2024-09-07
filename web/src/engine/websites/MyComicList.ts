import { Tags } from '../Tags';
import icon from './MyComicList.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + '/all',
        title: anchor.textContent.trim()
    };
}
function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.replace(/Comic$/, '').trim();
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'div.manga-right h1.manga-title', MangaLabelExtractor)
@Common.ChaptersSinglePageCSS('ul.basic-list li a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-container img.chapter_img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mycomiclist', `MyComicList`, 'https://mycomiclist.org', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]>{
        const mangalist : Manga[] = [];
        const paths = '0abcdefghijklmnopqrstuvwxyz'.split('');
        for (const letter of paths) {
            mangalist.push(... await Common.FetchMangasMultiPageCSS.call(this, provider, `/comic-list/?c=${letter}&page={page}`, 'div.serie-box ul li a'));
        }
        return mangalist;
    }
}