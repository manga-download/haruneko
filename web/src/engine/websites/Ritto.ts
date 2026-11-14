import { Tags } from '../Tags';
import icon from './Ritto.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapters = {
    items: {
        nombre: string;
        tituloExtra: string;
        href: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/obra\/[^/]+$/, 'h1.rf-hero__title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.app-card-grid-wide a.ritto-work-card', Common.PatternLinkGenerator('/catalogo?pagina={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLImageElement>('img.object-cover').alt.trim()
}))
@Common.PagesSinglePageCSS('img.reader-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ritto', 'Ritto', 'https://ritto.cc', Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { items } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'items' in data);
        return items.map(({ nombre, href, tituloExtra }) => new Chapter(this, manga, new URL(href, this.URI).pathname, [nombre, tituloExtra].joinTitleSegments()));
    }
}