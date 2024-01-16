import { Tags } from '../Tags';
import icon from './NextScan.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

const chapterScript = `
    new Promise(resolve => {
        const mangatitle = document.querySelector('article header h1').textContent.trim();
        const chapters = epX.arr
            .filter(chapter => chapter.url != window.location.href)
            .map(chapter => {
                return {
                    id : new URL(chapter.url).pathname,
                    title : chapter.title.replace(mangatitle, '').trim()
                }
            });

        resolve(chapters);
    });
`;

const pagesScript = `
    new Promise(resolve => {
        resolve([...document.querySelectorAll('div#readerarea img')].map(img => img.src));
    });
`;

type APIMangas = {
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

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'article header h1')
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nextscan', 'NextScan', 'https://www.nextscanid.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL('/feeds/posts/default/-/Series?orderby=published&alt=json&max-results=999', this.URI).href);
        const { feed } = await FetchJSON<APIMangas>(request);
        return feed.entry.map(manga => {
            const goodLink = manga.link.find(link => link.rel === 'alternate');
            return new Manga(this, provider, new URL(goodLink.href).pathname, goodLink.title.trim());
        });
    }

}