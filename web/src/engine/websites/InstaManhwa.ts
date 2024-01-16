import { Tags } from '../Tags';
import icon from './InstaManhwa.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const extract = Common.AnchorInfoExtractor(false, 'span.chapter-release-date');

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS('div.post-title h3 a', 0, '/latest?page={page}')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('instamanhwa', 'InstaManhwa', 'https://www.instamanhwa.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    private async GetToken(manga: Manga): Promise<string> {
        const { slug } = JSON.parse(manga.Identifier);
        const uri = new URL(slug, this.URI);
        const request = new Request(uri.href, {});
        const data = await FetchCSS<HTMLMetaElement>(request, 'meta[name="csrf-token"]');
        return data.shift().content;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const id = JSON.parse(manga.Identifier) as { post: string, slug: string };
        const uri = new URL('/ajax', this.URI);
        const request = new Request(uri.href, {
            method: 'POST',
            body: new URLSearchParams({
                '_token': await this.GetToken(manga),
                'action': 'manga_get_chapters',
                'manga': id.post
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': this.URI.href
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul li.wp-manga-chapter > a');
        return data.map(element => {
            const { id, title } = extract.call(this, element);
            return new Chapter(this, manga, id, title);
        });
    }
}
