import { Tags } from '../Tags';
import icon from './MangaMana.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    html: string;
};

const pageScript = `
    new Promise(resolve => {
        resolve (pages.map(page =>  'https://' + cdn + '.manga-mana.com/uploads/manga/' + oeuvre_slug + '/chapters_fr/' + chapter_slug + '/' + page.image + '?' + page.version));
    });
`;

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, 'h1.show_title')
@Common.ChaptersSinglePageCSS('ul.row li a', undefined, Common.AnchorInfoExtractor(false, 'div.small, span'))
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangamana', 'Manga Mana', 'https://www.manga-mana.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        const token = (await FetchCSS<HTMLMetaElement>(new Request(new URL('/liste-mangas', this.URI)), 'meta[name="csrf-token"]')).at(0).content;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const { html } = await FetchJSON<APIMangas>(new Request(new URL('/liste-mangas', this.URI), {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': token,
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: `page=${page}`
                }));
                const nodes = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>('a[class= ""]')];
                const mangas = nodes.map(({ pathname, text }) => new Manga(this, provider, pathname, text.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}