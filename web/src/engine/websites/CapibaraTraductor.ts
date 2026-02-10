import { Tags } from '../Tags';
import icon from './CapibaraTraductor.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { MangaScraper, type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import { TaskPool, Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        items: {
            manga: {
                title: string;
                slug: string;
            },
            organization: {
                slug: string;
            }
        }[];
    }
}

const chapterScript = `
    new Promise(resolve => {
        const element = document.querySelector('astro-island[component-url*="MangaDetailPageContainer"]');
        element.hydrator = () => (_, props) => {
            resolve(props.manga.chapters.map(chapter => {
                const title = ['Chapter', chapter.number, chapter.title ?? ''].join(' ').trim();
                return { id: location.pathname + '/chapters/' + chapter.number, title};
            }));
        };
        element.hydrate();
    });
`;

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/[^/]+\/manga\/[^/]+$/, 'div.grid div.relative img.object-cover', (img, url) => ({ id: url.pathname, title: img.alt.trim() }))
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div[id*="page"] img')].map(img => img.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

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
}