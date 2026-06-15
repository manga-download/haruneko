import { Tags } from '../Tags';
import icon from './MangaLector.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import * as Madara from './decorators/WordPressMadara';

type MangaID = {
    post: string;
    slug: string;
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.PagesSinglePageJS(`document.querySelector('p#arraydata').textContent.trim().split(',').map(img => atob(img.split('/').at(-1)));`, 250)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalector', 'MangaLector', 'https://mangalector.com', Tags.Media.Comic, Tags.Source.Aggregator, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const elements = await FetchCSS(new Request(new URL(`./ajax-load-manga?action=madara_load_more&page=${page}`, this.URI)), 'div[data-post-id]');
                const mangas = elements.map(element => {
                    const { title, pathname: slug } = element.querySelector('a');
                    return new Manga(this, provider, JSON.stringify({ post: element.dataset.postId, slug }), title);
                });
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { post } = <MangaID>JSON.parse(manga.Identifier);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`./ajax-list-chapter?mangaID=${post}`, this.URI)), 'li.wp-manga-chapter > a');
        return data.map(({ pathname, text }) => new Chapter(this, manga, pathname, text.trim()));
    }
}