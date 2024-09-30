import { Tags } from '../Tags';
import icon from './YuraManga.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type RSS = {
    feed: {
        entry: {
            title: {
                $t: string
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

const pagesScript = `[...document.querySelectorAll('div.isi_chapter div.bx_dl img')].map(img => img.dataset.src ?? img.src);`;

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'meta[name="description"]')
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(pagesScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yuramanga', 'YuraManga', 'https://www.yuramanga.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { feed: { entry } } = await FetchJSON<RSS>(new Request(new URL('/feeds/posts/default/-/Series?orderby=published&alt=json&max-results=999', this.URI)));
        return entry.map(manga => {
            const goodLink = manga.link.find(link => link.rel === 'alternate');
            return new Manga(this, provider, new URL(goodLink.href).pathname, goodLink.title);
        });
    }

}
