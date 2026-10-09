import { Tags } from '../Tags';
import icon from './MugiwaraNoStreaming.webp';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APIChapters = Record<string, number>;

@Common.MangaCSS<HTMLAnchorElement>(/^{origin}\/catalogue\/[^/]+\/scans\/[^/]+$/, 'main header h1 a')
@Common.MangasNotSupported() // TODO: Acquire Mangas (catalogue does not provide sub-variants such as original or colored)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #apiPool = new TaskPool(1, new RateLimit(3, 1));

    public constructor() {
        super('mugiwaranostreaming', 'Mugiwara no Streaming', 'https://www.mugiwara-no-streaming.com', Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { slugImage: mangaSlug } = await FetchNextJS<{ slugImage: string }>(new Request(new URL(manga.Identifier, this.URI)), data => 'slugImage' in data);
        const chapters = await this.#apiPool.Add(() => FetchJSON<APIChapters>(new Request(new URL(`./taille-proxy?slug=${mangaSlug}`, `${this.URI.origin}/api/`), {
            headers: { 'Sec-Fetch-Site': 'Same-Origin' },
        })), Priority.Normal);
        return Object.entries(chapters)
            .filter(([ _, pageCount ]) => pageCount)
            .map(([ chapterNumber, pageCount ]) => new Chapter(this, manga, `/${mangaSlug}/${chapterNumber}/${pageCount}`, `Chapitre ${chapterNumber}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const cdn = this.URI.origin.replace('www', 'scans');
        const [ , mangaSlug, chapterNumber, pageCount ] = chapter.Identifier.split('/');
        return Array.from({ length: Number(pageCount) }, (_, index) => {
            const uri = new URL(`${mangaSlug}/${chapterNumber}/${index + 1}.jpg`, cdn);
            return new Page(this, chapter, uri, { Referer: this.URI.href });
        });
    }
}
