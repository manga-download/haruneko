import { Tags } from '../Tags';
import icon from './BacaManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    list_chapter_html: string
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('h3.text-white').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'article header h1')
@Common.MangasMultiPageCSS('/daftar-komik/page/{page}/', 'div.grid div[id*="post-"] > a', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('div.img-landmine div#chimg-auh img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacamanga', 'BacaManga', 'https://bacamanga.cc', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaUrl = new URL(manga.Identifier, this.URI);
        let dom = await FetchHTML(new Request(mangaUrl));
        const series_id = new URL(dom.querySelector<HTMLLinkElement>('link[rel="shortlink"]').href).searchParams.get('p');
        const chapters = this.ExtractChapters(dom, manga, 'div#chapter-list > a');

        const { list_chapter_html } = await FetchJSON<APIChapters>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                action: 'get_list_chapter',
                series_id
            }).toString(),
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                Referer: mangaUrl.href,
                Origin: this.URI.origin
            }
        }));
        dom = new DOMParser().parseFromString(list_chapter_html, 'text/html');
        return chapters.concat( this.ExtractChapters(dom, manga, 'a'));
    }

    private ExtractChapters(document: Document, manga: Manga, selector: string): Chapter[] {
        return [...document.querySelectorAll<HTMLAnchorElement>(selector)].map(chapter => {
            const title = chapter.querySelector<HTMLDivElement>('div.text-white').innerText.trim();
            return new Chapter(this, manga, chapter.pathname, title);
        });
    }

}