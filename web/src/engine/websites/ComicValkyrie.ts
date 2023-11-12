import { Tags } from '../Tags';
import icon from './ComicValkyrie.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../FetchProvider';

function MangaExtractor(element: HTMLElement) {
    const id = new URL(element.querySelector('a').href).pathname.replace('/new.html', '/');
    const title = element.querySelector('.title').textContent.replace(/\s*THE COMIC\s*/i, '').trim();
    return { id, title };
}
function ChapterExtractor(element: HTMLElement) {
    const a = element.parentElement.querySelector<HTMLAnchorElement>('a.read_bt');
    const id = a.pathname;
    const title = element.textContent.trim();
    return { id, title };
}

@Common.MangasSinglePageCSS('/list', '.box_wrap .box', MangaExtractor)
@Common.ChaptersSinglePageCSS('#new_story .title, #back_number .title', ChapterExtractor)
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicvalkyrie', `Comic Valkyrie`, 'https://www.comic-valkyrie.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/[^/]+(/|/new.html)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLMetaElement>(request, 'meta[property = "og:title"]');
        const id = uri.pathname.replace('/new.html', '/');
        const title = data[0].content.replace(/\s*THE COMIC\s*/i, '').trim();
        return new Manga(this, provider, id, title);
    }
}