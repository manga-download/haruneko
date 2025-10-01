import { Tags } from '../Tags';
import icon from './ComicValkyrie.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(element: HTMLElement) {
    return {
        id: CleanPath(element.querySelector<HTMLAnchorElement>('a').pathname),
        title: CleanTitle(element.querySelector('.title').textContent)
    };
}
function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.parentElement.querySelector<HTMLAnchorElement>('a.read_bt').pathname,
        title: element.textContent.trim()
    };
}

function CleanTitle(title: string): string {
    return title.replace(/\s*THE COMIC\s*/i, '').trim();
}

function CleanPath(path: string): string {
    return path.replace('/new.html', '/');
}

@Common.MangasSinglePageCSS('/list', '.box_wrap .box', MangaExtractor)
@Common.ChaptersSinglePageCSS('#new_story .title, #back_number .title', undefined, ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax()
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
        const [element] = await FetchCSS<HTMLMetaElement>(new Request(url), 'meta[property = "og:title"]');
        return new Manga(this, provider, CleanPath(new URL(url).pathname), CleanTitle(element.content));
    }
}