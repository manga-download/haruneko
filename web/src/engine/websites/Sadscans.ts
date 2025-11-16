import { Tags } from '../Tags';
import icon from './Sadscans.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    result: {
        data: {
            json: {
                chapters: {
                    href: string;
                    name: string;
                    no: number;
                }[];
            };
        };
    };
}[];

@Common.MangaCSS(/{origin}\/seriler\/[^/]+$/, 'div.container h1', (heading, uri) => ({ id: uri.pathname, title: heading.innerText.trim() }))
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/seriler', 'a.block.group', anchor => ({ id: anchor.pathname, title: anchor.querySelector('h3').innerText.trim() }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('.reader-img')].map(image => image.src);`, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sadscans', `Sadscans`, 'https://sadscans.net', Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL('/api/trpc/seriesSingle.getSeriesData?batch=1', this.URI);
        uri.searchParams.set('input', JSON.stringify({ 0: { json: { sef: manga.Identifier.split('/').at(-1) } } }));
        const [{ result: { data: { json: { chapters } } } }]= await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(({ href, no, name })=> new Chapter(this, manga, href, `${no}. Bölüm - ${name}`));
    }
}