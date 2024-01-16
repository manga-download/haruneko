import { Tags } from '../Tags';
import icon from './MangaTube.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    success: {
        manga_title: string,
        manga_type: number,
        manga_slug: string,
        manga_id: number,
        manga_mature: number,
    }[]
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('b').textContent.trim() + ' ' + anchor.querySelector('span.chapter-name').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/series\//, 'h1.series-title')
@Common.ChaptersSinglePageCSS('div.vol-container ul.chapter-list li a[title]', ChapterExtractor)
@Common.PagesSinglePageJS('manga_reader.pages.map(page => manga_reader.img_path + page.file_name);', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatube', `MangaTube`, 'https://manga-tube.me', Tags.Language.German, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasList = [];
        const url = new URL('/ajax', this.URI);
        for (let page = 1, run = true; run; page++) {
            const formBody = new URLSearchParams({
                'action': 'load_series_list_entries',
                'parameter[page]': String(page),
                'parameter[letter]': '',
                'parameter[sortby]': 'alphabetic',
                'parameter[order]': 'asc'
            });
            const request = new Request(url.href, {
                method: 'POST',
                body: formBody,
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
            });
            const data = await FetchJSON<APIMangas>(request);
            const mangas = data.success.map(entry => new Manga(this, provider, '/series/'+entry.manga_slug, entry.manga_title.trim()));
            mangas.length > 0 ? mangasList.push(...mangas) : run = false;
        }
        return mangasList;
    }
}
