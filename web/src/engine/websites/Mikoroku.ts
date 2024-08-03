import { Tags } from '../Tags';
import icon from './Mikoroku.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

const pagesScript = `
    new Promise(resolve =>  resolve([...document.querySelectorAll('article#reader img')].map(img => img.src)));
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

const chapterScript = `
    new Promise ( resolve =>
        resolve (clwd.arr.filter(chapter => chapter.link != window.location.href)
            .map(chapter => {
                return {
                    id: new URL(chapter.link).pathname,
                    title : chapter.title.trim()
                };
            })
        )
    );
`;

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'header h1[itemprop="name"]')
@Common.ChaptersSinglePageJS(chapterScript, 500)
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

}