import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { type Chapter, DecoratableMangaScraper, Page, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'aside figure a.permalink', (element, uri) => ({ id: uri.pathname, title: element.querySelector<HTMLImageElement>('img').title.trim() }))
@Common.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a', undefined, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://doujindesu.tv', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const promises = ['Doujinshi', 'Manga', 'Manhwa'].map(type => {
            return Common.FetchMangasMultiPageCSS.call(this, provider, 'article.entry a', Common.PatternLinkGenerator(`/manga/page/{page}/?type=${type}`), 0, Common.AnchorInfoExtractor(true));
        });
        const mangas = (await Promise.all(promises)).flat();
        return mangas.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI);
        const [element] = await FetchCSS(new Request(chapterurl), "main#reader");
        const images = await FetchCSS<HTMLImageElement>(new Request(new URL('/themes/ajax/ch.php', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': chapterurl.href
            },
            body: new URLSearchParams({ id: element.dataset['id'] })
        }), 'img');
        return images.map(element => new Page(this, chapter, new URL(element.getAttribute('src'))));
    }
}
