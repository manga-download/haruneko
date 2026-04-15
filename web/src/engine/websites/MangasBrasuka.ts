import { Tags } from '../Tags';
import icon from './MangasBrasuka.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromBase64 } from '../BufferEncoder';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasbrasuka', 'Mangas Brasuka', 'https://mangasbrasuka.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //get adgate link
        const [crapLink] = await FetchCSS<HTMLAnchorElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.page-break a');
        const authParam: string = JSON.parse(new TextDecoder().decode(GetBytesFromBase64(new URL(crapLink.href).searchParams.get('o').split('/').at(-1)))).url;
        //get real url (redirected)
        const response = await Fetch(new Request(new URL(crapLink.href)));
        const newURL = response.url.replace('/ref/', '/finish/cpurl/');
        await FetchWindowScript<string[]>(new Request(new URL(newURL)), '', 5000);
        const pages = await FetchCSS<HTMLImageElement>(new Request(new URL(`/campanha.php?auth=${encodeURIComponent(authParam)}`, this.URI)), 'div.manga-content img');
        return pages.map(page => new Page(this, chapter, new URL(page.src)));
    }
}