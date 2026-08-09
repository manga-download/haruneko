import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';

type APIMangas = {
    garimpo: {
        slug: string;
        title: string;
    }[];
};

type HydratedChapters = {
    capitulos_lista: {
        id: string;
        title: string;
    }[];
};

type APIPages = {
    chapter: {
        content: string[];
    };
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/obra\/[^/]+$/, 'main img.object-cover', (img, uri) => ({ id: uri.pathname.split('/').at(-1), title: img.alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://yomu.com.br/api/';

    public constructor() {
        super('yomucomics', 'Yomu Comics', 'https://yomu.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { garimpo } = await FetchJSON<APIMangas>(new Request(new URL('./library?page=1&limit=99999&sort=popular&type=all', this.apiURL)));
        return garimpo.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { capitulos_lista } = await FetchNextJS<HydratedChapters>(new Request(new URL(`./obra/${manga.Identifier}`, this.URI)), data => 'capitulos_lista' in data && 'author' in data);
        return capitulos_lista.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { content } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters?id=${chapter.Identifier}`, this.apiURL)));
        return content.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}