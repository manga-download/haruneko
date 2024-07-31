import { Tags } from '../Tags';
import icon from './Mikoroku.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const pagesScript = `
    new Promise(resolve => { resolve([...document.querySelectorAll('article#reader img')].map(img => img.src)); });
`;

type RSS = {
    feed: {
        entry: {
            title: {
                $t : string
            },
            link: {
                rel: string
                title: string,
                href: string
            }[]
        }[]
    }
}

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'header h1[itemprop="name"]')
@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mikoroku', 'Mikoroku', 'https://www.mikoroku.web.id', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { feed: { entry } } = await FetchJSON<RSS>(new Request(new URL('/feeds/posts/default/-/Series?orderby=published&alt=json&max-results=999', this.URI)));
        return entry.map(manga => {
            const goodLink = manga.link.find(link => link.rel === 'alternate');
            return new Manga(this, provider, new URL(goodLink.href).pathname, goodLink.title.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid = await FetchWindowScript<string>(new Request(new URL(manga.Identifier, this.URI)), 'clwd.settings.cat');
        const { feed: { entry } } = await FetchJSON<RSS>(new Request(new URL(`/feeds/posts/default/-/${mangaid}?orderby=published&alt=json&max-results=9999`, this.URI)));
        return entry.map(entry => {
            const goodLink = entry.link.find(link => link.rel === 'alternate');
            return new Chapter(this, manga, new URL(goodLink.href, this.URI).pathname, goodLink.title.replace(manga.Title, '').trim());
        }).filter(chap => chap.Identifier != manga.Identifier);
    }

}