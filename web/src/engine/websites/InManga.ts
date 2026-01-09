import { Tags } from '../Tags';
import icon from './InManga.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIResult = {
    data: string;
};

type APIChapters = {
    result: {
        Identification: string;
        FriendlyChapterNumber: string;
        FriendlyChapterNumberUrl: string;
        Number: number;
    }[];
};

const pageScript = `
    new Promise( resolve => {
        const images = [...document.querySelectorAll('div.PagesContainer img.ImageContainer')];
        resolve(
            images.map(image=> pageController._containers.pageUrl.replace('identification', image.id).replace('pageNumber', image.dataset.pagenumber))
        );
    });
`;

@Common.MangaCSS(/^{origin}\/ver\/manga\/[^/]+\/[^/]+$/, 'div.panel-heading h1')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('inmanga', `InManga`, 'https://inmanga.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this
        const uri = new URL('/manga/getMangasConsultResult', this.URI);
        const mangasPerPage = 500;
        const body = new URLSearchParams({
            'filter[generes][]': '-1',
            'filter[queryString]': '',
            'filter[take]': `${mangasPerPage}`,
            'filter[sortby]': '5',
            'filter[broadcastStatus]': '0',
            'filter[onlyFavorites]': 'false',
            'd': '',
        });
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                body.set('filter[skip]', `${mangasPerPage * page}`);
                const data = await FetchCSS<HTMLAnchorElement>(new Request(uri, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': this.URI.href
                    },
                    body
                }), 'a.manga-result');
                const mangas = data.map(element => new Manga(this, provider, element.pathname, element.querySelector<HTMLHeadingElement>('h4.ellipsed-text').textContent.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = manga.Identifier.split('/').at(-1);
        const { data } = await FetchJSON<APIResult>(new Request(new URL(new URL(`/chapter/getall?mangaIdentification=${mangaId}`, this.URI))));
        const { result } = JSON.parse(data) as APIChapters;
        return result.sort((self, other) => other.Number - self.Number)
            .map(({ Identification: id, FriendlyChapterNumber: title, FriendlyChapterNumberUrl: numberUrl }) => new Chapter(this, manga, manga.Identifier.replace(mangaId, `${numberUrl}/${id}`), title));
    }
}