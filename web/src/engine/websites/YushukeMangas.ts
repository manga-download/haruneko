import { Tags } from '../Tags';
import icon from './YushukeMangas.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';

type ChaptersData = {
    chapters: string,
    remaining: number
}

const ChapterInfoExtractor = Common.AnchorInfoExtractor(false, 'span:not(.capitulo-numero)');

@Common.MangaCSS(/^{origin}\/manga\/[^/]+/, 'div.manga-details div.manga-title-row h1')
@Common.MangasMultiPageCSS('div.manga-list div.manga-card a.manga-title', Common.PatternLinkGenerator('/?pagina={page}'))
@Common.PagesSinglePageCSS('picture img:not([src*=".xml"]):not([src*="/fim.png"]):not([src*="/convidar.jpg"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yushukemangas', 'Yushuke Mangas', 'https://new.yushukemangas.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [mangaId] = await FetchRegex(new Request(new URL(manga.Identifier, this.URI)), /mangaId\s*=\s*(\d+)/g);
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const uri = new URL(`/ajax/lzmvke.php?manga_id=${mangaId}&page=${page}`, this.URI);
            const { chapters, remaining } = await FetchJSON<ChaptersData>(new Request(uri));
            chapterList.push(...this.ExtractChapters(manga, chapters, uri));
            run = remaining > 0;
        }
        return chapterList;
    }

    private ExtractChapters(manga: Manga, html: string, uri: URL): Chapter[] {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        return [...dom.querySelectorAll<HTMLAnchorElement>('a.chapter-item')].map(chapter => {
            const { id, title } = ChapterInfoExtractor.call(this, chapter, uri);
            return new Chapter(this, manga, id, title);
        });
    }
}