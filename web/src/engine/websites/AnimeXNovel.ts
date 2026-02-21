import { Tags } from '../Tags';
import icon from './AnimeXNovel.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { type Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapter = {
    link: string;
    slug: string;
    title: {
        rendered: string;
    }
};

@Common.MangaCSS(/^{origin}\/man(ga|hua|hwa)\/[^/]+\/$/, 'span.eb-breadcrumb-item.current')
@Common.MangasSinglePageCSS('/mangas', 'a.eael-grid-post-link')
@Common.PagesSinglePageCSS('div.spice-block-img-gallery figure img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('animexnovel', 'Anime X Novel', 'https://www.animexnovel.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'div#container-capitulos')).at(0).dataset.categoria.trim();
        const posts = await FetchJSON<APIChapter[]>(new Request(new URL(`./wp-json/wp/v2/posts?categories=${mangaId}&orderby=date&order=asc&per_page=5000&page=1`, this.URI)));
        return posts.filter(({ link }) => link != new URL(manga.Identifier, this.URI).href)
            .map(({ title: { rendered }, link }) => new Chapter(this, manga, new URL(link).pathname, this.DecodeEntities(rendered).replace(manga.Title, '') || this.DecodeEntities(rendered)));

    }

    private DecodeEntities(text: string): string {
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.documentElement.textContent.trim();
    }
}