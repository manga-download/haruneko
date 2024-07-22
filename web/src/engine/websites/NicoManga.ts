import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS } from '../platform/FetchProvider';

const chapterScript = `
    new Promise(async (resolve, reject) => {
        try {
            const uri = new URL('app/manga/controllers/cont.Listchapterapi.php', window.location.origin);
            uri.searchParams.set('slug', sLugs);
            const response = await fetch(uri);
            data = await response.text();
            const dom = new DOMParser().parseFromString(data, "text/html");
            const nodes = [...dom.querySelectorAll('ul > a')];
            const chapters= nodes.map(chapter => {
                return {
                    id : chapter.pathname,
                    title : chapter.title
                };
            });
            resolve(chapters);
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/manga[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', `NicoManga`, 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new Request(new URL(chapter.Identifier, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const chapterid = (await FetchCSS<HTMLInputElement>(request, 'input#chapter'))[0].value;
        request = new Request(new URL(`/app/manga/controllers/cont.imgsList.php?cid=${chapterid}`, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const nodes = await FetchCSS(request, 'img.chapter-img:not([alt*="nicoscan"])');
        return nodes.map(image => new Page(this, chapter, new URL(image.dataset.src.replace(/\n/g, ''), this.URI)));
    }
}