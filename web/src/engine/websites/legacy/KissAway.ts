import { Tags } from '../../Tags';
import icon from './KissAway.webp';
import { type Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as FlatManga from '../decorators/FlatManga';
import { FetchRequest, FetchWindowScript } from '../../FetchProvider';

const chapterScript = `
    new Promise(async resolve => {
        const uri = new URL('app/manga/controllers/cont.listChapter.php', window.location.origin);
        uri.searchParams.set('slug', dataL);
        const response = await fetch(uri);
        data = await response.text();
        const dom = new DOMParser().parseFromString(data, "text/html");
        const nodes = [...dom.querySelectorAll('a.chapter[title]')];
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

const pageScript = `
    new Promise(async resolve => {
        const chapId = document.querySelector('input#chapter').value;
        const uri = new URL('app/manga/controllers/cont.listImg.php', window.location.origin);
        uri.searchParams.set('cid', chapId);
        const response = await fetch(uri);
        const data = await response.text();
        const dom = new DOMParser().parseFromString(data, "text/html");
        const nodes = [...dom.querySelectorAll('img.chapter-img')];
        resolve(nodes.map(picture => picture.src));
    });
`;

//TODO Implement at request level a BYPASS for this DDOSS protection
//its not triggered on main page but on manga page

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas)
@Common.PagesSinglePageJS(pageScript, 1000)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    private ddosProtectionPassed = false;

    public constructor() {
        super('kissaway', `KLManga`, 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (!this.ddosProtectionPassed) {
            await FetchWindowScript(new FetchRequest(new URL(manga.Identifier, this.URI).href), '', 5000);
            this.ddosProtectionPassed = true;
        }
        return Common.FetchChaptersSinglePageJS.call(this, manga, chapterScript, 1000);
    }

}
