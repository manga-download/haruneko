import { Tags } from '../Tags';
import icon from './CapibaraTraductor.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, DecoratableMangaScraper } from '../providers/MangaPlugin';
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

@Common.MangaCSS(/^{origin}\/[^/]+\/manga\/[^/]+$/, 'title', (element, url) => ({
    id: url.pathname,
    title: element.textContent.split('|')[0].trim()
}))
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

@Common.PagesSinglePageJS(`
    (function() {
        function isPages(list) {
            return Array.isArray(list) && list.length > 0 && list.every(function(page) {
                return page && typeof page.imageUrl === 'string' && /^https?:/.test(page.imageUrl) && typeof page.number === 'number' && typeof page.chapterId === 'number';
            });
        }
        var pages = null;

        function walk(fiber) {
            for (; fiber; fiber = fiber.sibling) {
                for (var hook = fiber.memoizedState; hook && typeof hook === 'object' && 'next' in hook && 'queue' in hook; hook = hook.next) {
                    if (isPages(hook.memoizedState) && (!pages || hook.memoizedState.length > pages.length)) pages = hook.memoizedState;
                }
                if (fiber.child) walk(fiber.child);
            }
        }
        document.querySelectorAll('*').forEach(function(element) {
            Object.keys(element).forEach(function(key) {
                if (key.indexOf('__reactContainer$') === 0) {
                    var fiber = element[key];
                    walk(fiber.stateNode && fiber.stateNode.current || fiber);
                }
            });
        });
        if (!pages) return null;
        // The reader leaves one placeholder on every page when its own decode fails
        var urls = pages.map(function(page) {
            return page.imageUrl;
        });
        return urls.length > 1 && new Set(urls).size === 1 ? null : urls;
    })();
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
}