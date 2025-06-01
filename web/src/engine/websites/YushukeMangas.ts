import { Tags } from '../Tags';
import icon from './YushukeMangas.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type ChaptersData = {
    chapters: string,
    remaining : number
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+/, 'div.manga-details div.manga-title-row h1')
@Common.MangasMultiPageCSS('/?pagina={page}', 'div.manga-list div.manga-card a.manga-title')
@Common.PagesSinglePageCSS('picture img:not([src*=".xml"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yushukemangas', 'Yushuke Mangas', 'https://new.yushukemangas.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'button#CarregarCapitulos')).shift().dataset.mangaId;
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const { chapters, remaining } = await FetchJSON<ChaptersData>(new Request(new URL(`/ajax/lzmvke.php?manga_id=${mangaId}&page=${page}&order=DESC`, this.URI)));
            chapterList.push(...this.ExtractChapters(manga, chapters));
            run = remaining > 0;
        }
        return chapterList;
    }

    private ExtractChapters(manga: Manga, html: string): Chapter[] {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return [...doc.querySelectorAll<HTMLAnchorElement>('a.chapter-item')].map(chapter => {
            const { id, title } = Common.AnchorInfoExtractor(false, 'span:not(.capitulo-numero)').call(this, chapter);
            return new Chapter(this, manga, id, title);
        });
    }
}