import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        id: number,
        name: string,
        slug: string
    }[]

}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector < HTMLSpanElement>('span').textContent.trim().replaceAll(/[\n\t\r]/g, '')
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'title', (element) => element.textContent.split('|').at(0).trim())
@Common.ChaptersSinglePageCSS('div.grid a.group[href*="/read/"]', ChapterExtractor)
@Common.PagesSinglePageCSS('div.grid img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lectorjpg', 'LectorJPG', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL('./serie-query?y?cursor=&perPage=9999&type=query&genres=&name=', this.URI)));
        return data.map(manga => new Manga(this, provider, `/series/${manga.slug}`, manga.name));
    }
}