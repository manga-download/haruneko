import { Tags } from '../Tags';
import icon from './ComicExtra.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname + '/full';
    const title = anchor.text.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, '.title-1')
@Common.ChaptersSinglePageCSS('#list tr td a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicextra', `ComicExtra`, 'https://comixextra.com', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin) : Promise<Manga[]>{
        const mangalist : Manga[] = [];
        const paths = ['others'].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const letter of paths) {
            mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, '/comic-list/' + letter, '.home-list .hl-box .hlb-t a'));
        }
        return mangalist;
    }
}