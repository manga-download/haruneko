import { Tags } from '../Tags';
import { FetchNextJS } from '../platform/FetchProvider';
import { type Chapter, Page, type DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';

type HydratedPages = {
    images: {
        url: string;
        order: number;
    }[]
};

export async function FetchPages(this: DecoratableMangaScraper, chapter: Chapter): Promise < Page[] > {
    const { images } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
    return images.sort((self, other) => (self.order || 0) - (other.order || 0))
        .map(({ url }) => new Page(this, chapter, new URL(url)));
}

export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FetchPages.call(this, chapter);
    }
}