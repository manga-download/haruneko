import { Tags } from '../Tags';
import icon from './RobinManga.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';

@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('robinmanga', 'RobinManga', 'https://robinmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const dom = await FetchHTML(new Request(uri));
        const title = dom.querySelector<HTMLAnchorElement>('ol.breadcrumb li:last-of-type a').text.trim();
        const postid = dom.querySelector<HTMLInputElement>('input#comment_post_ID').value;
        const id = JSON.stringify({ post: postid, slug: uri.pathname });
        return new Manga(this, provider, id, title);
    }

}