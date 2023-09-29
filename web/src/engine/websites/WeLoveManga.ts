import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS, FetchRequest } from '../FetchProvider';

const chapterScript = `
    new Promise(async resolve => {
        loadChapterData(mIds);
        const nodes = [...document.querySelectorAll('ul.list-chapters a[title]')];
        const chapters= nodes.map(chapter => {
            return {
                id : chapter.pathname,
                title : chapter.title
            };
        });
        const uniqueChapters = chapters.filter((obj, index) =>chapters.findIndex((item) => item.id === obj.id) === index );
        resolve(uniqueChapters);
    });
`;

@Common.MangaCSS(/^https?:\/\/welovemanga\.one\/(mgraw-)?\d+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga-list.html?page={page}', FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lovehug', `WeloveManga`, 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let url = new URL(chapter.Identifier, this.URI);
        let request = new FetchRequest(url.href, {
            headers: {
                'Referer': this.URI.href,
            }
        });
        const chapterid = (await FetchCSS<HTMLInputElement>(request, 'input#chapter'))[0].value;

        url = new URL(`/app/manga/controllers/cont.listImg.php?cid=${chapterid}`, this.URI);
        request = new FetchRequest(url.href, {
            headers: {
                'Referer': this.URI.href,
            }
        });
        const nodes = await FetchCSS(request, 'img.chapter-img');
        return nodes.map(image => new Page(this, chapter, new URL(image.dataset.original.replace(/\n/g, ''))));
    }

}