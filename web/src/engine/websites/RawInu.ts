import { Tags } from '../Tags';
import icon from './RawInu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

const chapterScript = `
    new Promise(async resolve => {
        const uri = new URL('app/manga/controllers/cont.Listchapter.php', window.location.origin);
        const slug = document.documentElement.innerHTML.match(/var slugs\\s*=\\s*'([^']+)/i)[1];
        uri.searchParams.set('slug', slug);
        const response = await fetch(uri);
        data = await response.text();
        const dom = new DOMParser().parseFromString(data, "text/html");
        const nodes = [...dom.querySelectorAll('a')];
        const chapters= nodes.map(chapter => {
            return {
                id : chapter.pathname,
                title : chapter.title.trim()
            };
        });
        resolve(chapters);
    });
`;

const pageScript = `
    new Promise(async resolve => {
        const chapId = document.querySelector('input#chapter').value;
        const uri = new URL('app/manga/controllers/cont.imagesChap.php', window.location.origin);
        uri.searchParams.set('cid', chapId);
        const response = await fetch(uri);
        const data = await response.text();
        const dom = new DOMParser().parseFromString(data, "text/html");
        const nodes = [...dom.querySelectorAll('img')];
        resolve(nodes.map(picture => picture.dataset.src.trim()));
    });
`;

@Common.MangaCSS(/^{origin}\/[^.]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawinu', `RawInu`, 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}