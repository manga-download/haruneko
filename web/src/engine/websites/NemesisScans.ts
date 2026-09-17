import { Tags } from '../Tags';
import icon from './NemesisScans.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        _id: number;
        title: {
            english: string;
            romaji: string;
        };
    }[];
};

@Common.MangaCSS(/^{origin}\/series\/\d+\/[^/]+$/, 'nav.breadcrumb span.bc-current')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.chapters-list a.chapter-item', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.chap-num').textContent.trim()
}), true)
@Common.PagesSinglePageCSS('div.pages-container div.manga-page-wrapper img.manga-page')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nemesisscans', 'Nemesis Scans', 'https://www.nemesisscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`https://yahsirou.xyz/series?page=${page}`)));
                const mangas = data.map(({ _id, title: { english, romaji } }) => new Manga(this, provider, `/series/${_id}/${this.GetSlug(english ?? romaji)}`, english ?? romaji));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    private GetSlug(mangaTitle: string): string {
        const turkishMap = {
            ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u'
        };
        const turkishRegex = /[çğışöü]/g;
        return mangaTitle
            .toLowerCase()
            .replace(turkishRegex, t => turkishMap[t])
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80);
    }
}