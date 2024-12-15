import { Tags } from '../Tags';
import icon from './BacaManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

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
        const [ elementChapterList, elementLoadingButton ] = await FetchCSS<HTMLElement>(new Request(mangaUrl), 'div#chapter-list, button#load-more-chapter');
        const { list_chapter_html } = await FetchJSON<APIChapters>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                action: 'get_list_chapter',
                series_id: elementLoadingButton.getAttribute('series-id'),
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));
        elementChapterList.append(...new DOMParser().parseFromString(list_chapter_html, 'text/html').body.childNodes.values());

        return [...elementChapterList.querySelectorAll<HTMLAnchorElement>('a')].map(element => {
            const title = element.querySelector<HTMLDivElement>('div.number-chapter').innerText.trim();
            return new Chapter(this, manga, element.pathname, title);
        });
    }
}