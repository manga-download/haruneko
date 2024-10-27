import { type Tag, Tags } from '../Tags';
import icon from './ManhwaHentaiMe.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchHTML } from '../platform/FetchProvider';

type MangaID = {
     post: string;
     slug: string;
}

const AnchorInfoExtractor = Common.AnchorInfoExtractor(false, 'span');

function CleanTitle(title: string): string {
    return title.replace(/(-)?\s*Webtoon Manhwa Hentai$/, '').trim();
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const container = anchor.closest<HTMLElement>('div.page-item-detail, div.manga');
    const post = container?.querySelector<HTMLElement>('div[id*="manga-item-"]')?.getAttribute('id').match(/(\d+$)/)[1] || '';
    const slug = anchor.pathname;
    const title = CleanTitle(anchor.text);
    const id = JSON.stringify({ post, slug });
    return { id, title };
}

@Common.MangasMultiPageCSS('/home/page/{page}/', 'div.post-title h3 a, div.post-title h5 a', 1, 1, 0, MangaInfoExtractor)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor(id: string = 'manhwahentaime', label: string = 'ManhwaHentai.me', url: string = 'https://manhwahentai.me', tags: Tag[] = [Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon/[^/]+\/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const data = await FetchHTML(new Request(uri));
        const post = data.querySelector<HTMLElement>('div#star[data-id]')?.dataset?.id;
        const element = data.querySelector<HTMLElement>('div.post-title h1');
        const title = CleanTitle(AnchorInfoExtractor.call(this, element).title);
        return new Manga(this, provider, JSON.stringify({ post, slug: uri.pathname }), title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const id = JSON.parse(manga.Identifier) as MangaID;
        const request = new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                action: 'ajax_chap',
                post_id: id.post
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Referer: this.URI.href
            }
        });

        const data = await FetchCSS(request, 'ul li.wp-manga-chapter > a');
        return data.map(element => {
            const { id, title } = AnchorInfoExtractor.call(this, element);
            return new Chapter(this, manga, id, title.replace(manga.Title, '').trim());
        });
    }

}