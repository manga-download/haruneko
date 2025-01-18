import { Tags } from '../Tags';
import icon from './UlasComic.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type FeedResults = {
    feed: {
        entry: {
            link: {
                rel: string,
                href: string,
                title: string
            }[],
        }[]
    }
}

const pageScript = `[...document.querySelectorAll('div#readerarea img')].map(page => page.src);`;

const chapterScript = `
    new Promise(resolve => {
        resolve ( [...document.querySelectorAll('div#chapterlist ul li a')].map(chapter => {
            return {
                id:  chapter.pathname,
                title: chapter.querySelector('.chapternum').textContent.trim()
            }
        }));
    });
 `;

@MangaStream.MangaCSS(/^{origin}\/\d+\/\d+\/[^.]+\.html$/)
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ulascomic', 'Ulas Comic', 'https://www.ulascomic.xyz', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(new URL(`/feeds/posts/summary/-/Series?start-index=1&max-results=99999&alt=json`, this.URI));
        const { feed: { entry } } = await FetchJSON<FeedResults>(request);
        return entry.map(manga => {
            const link = manga.link.find(value => value.rel == 'alternate');
            return new Manga(this, provider, new URL(link.href).pathname, link.title);
        });
    }

}