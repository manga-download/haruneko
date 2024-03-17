import { Tags } from '../Tags';
import icon from './ComicOnlineFree.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/full';
    const title = anchor.text.trim();
    return { id, title };
}
function PageExtractor(element: HTMLImageElement): string {
    return element.dataset.original || element.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'div.manga-details td strong')
@Common.ChaptersSinglePageCSS('ul.basic-list li a.ch-name', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-container img', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comiconlinefree', `ComicOnlineFree`, 'https://comiconlinefree.org', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]>{
        const mangalist : Manga[] = [];
        const paths = ['others'].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const letter of paths) {
            mangalist.push(... await Common.FetchMangasMultiPageCSS.call(this, provider, `/comic-list/${letter}/{page}`, 'div.chapter a.jtip'));
        }
        return mangalist;
    }
}