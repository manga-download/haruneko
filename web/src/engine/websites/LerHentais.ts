import { Tags } from '../Tags';
import icon from './LerHentais.webp';
import { FetchRegex } from '../platform/FetchProvider';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { HiperManga } from './templates/HiperManga';

export default class extends HiperManga {

    public constructor() {
        super('lerhentais', 'LerHentais', 'https://lerhentais.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    private CreateManga(provider: MangaPlugin, slug: string, title?: string) {
        title ??= decodeURIComponent(slug).replaceAll('-', ' ').replace(/(^|\s)\S/g, character => character.toUpperCase());
        return new Manga(this, provider, slug, title);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { Identifier, Title } = await super.FetchManga(provider, url);
        return this.CreateManga(provider, Identifier.split('/').at(-1), Title);
    }

    /**
     * The search API used by the template is limited to 1000 results (the website has more than 14000).
     * The sitemap lists all series, but without title or ID, therefore the title is derived from the slug and the ID is looked up when the chapters are requested.
     */
    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const slugs = await FetchRegex(new Request(new URL('/sitemap-series.xml', this.URI)), /<loc>[^<]*\/manga\/([^/<]+)<\/loc>/g);
        return slugs.map(slug => this.CreateManga(provider, slug));
    }
}
