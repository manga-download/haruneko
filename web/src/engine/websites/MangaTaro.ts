import { Tags } from '../Tags';
import icon from './MangaTaro.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Manga, type MangaPlugin, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLButtonElement>(/^{origin}\/manga\/[^/]+$/, 'button[data-manga-title]', (button, uri) => ({ id: uri.pathname, title: button.dataset.mangaTitle.trim() }))
@Common.ChaptersSinglePageCSS('div.chapter-list  a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('img.comic-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangataro', 'MangaTaro', 'https://mangataro.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return Array.fromAsync(async function* () {
            for (let page = 1, run = true; run; page++) {
                const data = await FetchJSON<{ title: string, url: string; }[]>(new Request(new URL('/wp-json/manga/v1/load', this.URI), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ page })
                }));
                const mangas = data.map(({ url, title }) => new Manga(this, provider, new URL(url, this.URI).pathname, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}