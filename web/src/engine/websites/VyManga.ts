import { Tags } from '../Tags';
import icon from './VyManga.webp';
import { Fetch } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div.comic-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.div-manga h1.title')
@Common.MangasMultiPageCSS('/search?page={page}', 'div.comic-item > a', 1, 1, 0, MangaExtractor)
@Common.PagesSinglePageCSS('div.carousel-item[data-page] img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vymanga', 'VyManga', 'https://vymanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI));
        // NOTE: Making multiple requests attempting to get a response with the "good" (direct) chapter links
        const results = await Promise.allSettled(new Array(8).fill(0).map(() => Fetch(request).then(response => response.text())));
        const [ html ] = results.filter(p => p.status === 'fulfilled').map(p => p.value).sort((self, other) => self.length - other.length);
        const dom = new DOMParser().parseFromString(html, 'text/html');
        return [ ...dom.body.querySelectorAll<HTMLAnchorElement>('div.div-chapter div.list-group a') ].map(anchor => {
            const title = anchor.querySelector('span').textContent.trim();
            return new Chapter(this, manga, anchor.hostname === this.URI.hostname ? anchor.pathname : anchor.href, title);
        });
    }
}