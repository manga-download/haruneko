import { Tags } from '../../Tags';
import icon from './ComicValkyrie.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as SpeedBind from '../decorators/SpeedBind';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

function MangaExtractor(element: HTMLElement) {
    const id = new URL(element.querySelector('a').href).pathname.replace('/new.html', '').slice(1);
    const title = element.querySelector('.title').textContent.replace(/\s*THE COMIC\s*/i, '').trim();
    return { id, title };
}
function ChapterExtractor(element: HTMLElement) {
    const a: HTMLAnchorElement = element.parentElement.querySelector('a.read_bt');
    const id = a.href;
    const title = element.textContent.trim();
    return { id, title };
}

@Common.MangasSinglePageCSS('/list', '.box_wrap .box', MangaExtractor)
@Common.ChaptersSinglePageCSS('#new_story .title, #back_number .title', ChapterExtractor)
@SpeedBind.PagesSinglePage()
@SpeedBind.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicvalkyrie', `Comic Valkyrie`, 'https://www.comic-valkyrie.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https?:\/\/www\.comic-valkyrie\.com\/\S+\/new.html$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS<HTMLMetaElement>(request, 'meta[property = "og:title"]');
        const id = uri.pathname.replace('/new.html', '').slice(1);
        const title = data[0].content.replace(/\s*THE COMIC\s*/i, '').trim();
        return new Manga(this, provider, id, title);
    }
}