import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedMangaData = {
    aea: {
        id: number,
        name: string,
        slug: string,
    }[]
};

@Common.MangaCSS(/^{origin}\/ver\/[^/]+$/, 'meta[property="og:title"]')
@Common.ChaptersSinglePageCSS('div[class*="infoProject_divListChapter"] a[class*="infoProject_divChapter"]', Common.AnchorInfoExtractor(false, 'span:not([class*="infoProject_numChapter"])'))
@Common.PagesSinglePageCSS('main.read img[class*="readChapter_image"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.com', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('./comics', this.URI));
        const { aea: entries } = await FetchNextJS<HydratedMangaData>(request, data => data['aea']);
        return entries.map(entry => new Manga(this, provider, `/ver/${entry.slug}`, entry.name));
    }
}