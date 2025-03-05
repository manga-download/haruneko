import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number,
    name: string,
    slug: string
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span[class*="infoProject_numChapter"]').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/ver\/[^/]+$/, 'h1[class*="infoProject_titulo_"]')
@Common.ChaptersSinglePageCSS('div[class*="infoProject_divListChapter__"] a[class*="infoProject_divChapter"]', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://apis.eternalmangas.com/api/';

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.com', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIManga[]>(new Request(new URL('./comics', this.apiUrl)));
        return data.map(manga => new Manga(this, provider, `/ver/${manga.slug}`, manga.name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [form] = await FetchCSS<HTMLFormElement>(new Request(new URL(chapter.Identifier, this.URI)), 'form:has(input[name="chapter_slug"])');
        const parameters = new URLSearchParams();
        [...form.querySelectorAll<HTMLInputElement>('input')].forEach(inputElement => parameters.set(inputElement.name, inputElement.value));
        const request = new Request(new URL(form.getAttribute('action')), {
            method: 'POST',
            body: parameters.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: this.URI.origin,
                Referer: this.URI.href
            }
        });
        return (await FetchCSS<HTMLImageElement>(request, 'img[data-src]')).map(image => new Page(this, chapter, new URL(image.dataset.src || image.src)));
    }
}