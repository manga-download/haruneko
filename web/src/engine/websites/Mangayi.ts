import { Tags } from '../Tags';
import icon from './Mangayi.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    i: string;
    t: string;
}[];

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/read\/[^/]+\/$/, 'aside h1.title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.chapters a:not(.unreleased)', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('p.t').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangayi', 'Mangayi', 'https://mangayi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIMangas>(new Request(new URL('./api/search', this.URI), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ t: 1 })
        }));
        return mangas.map(({ t, i }) => new Manga(this, provider, `/read/${i}/`, t));
    }
}