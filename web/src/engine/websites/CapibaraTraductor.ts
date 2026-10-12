import { Tags } from '../Tags';
import icon from './CapibaraTraductor.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, DecoratableMangaScraper, Page, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{
    items: {
        manga: {
            title: string;
            slug: string;
        },
        organization: {
            slug: string;
        };
    }[];
}>;

type APIPages = APIResult<{
    imageUrl: string;
}[]>

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/[^/]+\/manga\/[^/]+$/, 'div.grid div.relative img.object-cover', (img, url) => ({ id: url.pathname, title: img.alt.trim() }))
@Common.ChaptersSinglePageJS(`
    new Promise(resolve => {
        const element = document.querySelector('astro-island[component-url*="MangaDetailPageContainer"]');
        element.hydrator = () => (_, props) => {
            resolve(props.manga.chapters.map(chapter => {
                const calculatedTitle= ['Capítulo', chapter.number].join(' ').trim();
                const title = calculatedTitle === chapter.title ? calculatedTitle : [calculatedTitle, chapter.title].join(' ').trim();
                return { id: location.pathname + '/chapters/' + chapter.number, title};
            }));
        };
        element.hydrate();
    });
`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('capibaratraductor', 'Capibara Traductor', 'https://capibaratraductor.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data: { items } } = await FetchJSON<APIMangas>(new Request(new URL('./api/manga-custom?page=1&limit=9999', this.URI)));
        return items.map(({ manga: { slug, title }, organization: { slug: orgaSlug } }) => new Manga(this, provider, `/${orgaSlug}/manga/${slug}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [, team, , mangaSlug, , chapterNumber] = chapter.Identifier.split('/');
        const prefix = team === 'joint' ? 'joint' : 'manga-custom';

        const { data } = await FetchJSON<APIPages>(new Request(new URL(`./${prefix}/${mangaSlug}/chapter/${chapterNumber}/pages`, this.apiURL), {
            headers: {
                'X-Organization': team != 'joint' ? team : undefined
            }
        }));
        return data.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }
}