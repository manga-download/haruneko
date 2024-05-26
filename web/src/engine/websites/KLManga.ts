import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

const chapterScript = `
    new Promise(async resolve => {
        const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomEndpoint = '';
        for (let o = 0; o < 25; o++) randomEndpoint += r.charAt(Math.floor(Math.random() * r.length));
        const uri = new URL(randomEndpoint + '.lstc', window.location.origin);
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
        resolve(chapters);
    });
`;

const pageScript = `
    new Promise(async resolve => {
        const chapId = document.querySelector('input#chapter').value;
        const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomEndpoint = '';
        for (let o = 0; o < 30; o++) randomEndpoint += r.charAt(Math.floor(Math.random() * r.length));
        const uri = new URL(randomEndpoint + '.iog', window.location.origin);
        uri.searchParams.set('cid', chapId);
        const response = await fetch(uri);
        const data = await response.text();
        const dom = new DOMParser().parseFromString(data, "text/html");
        const nodes = [...dom.querySelectorAll('img.chapter-img[alt*="Page"]')];
        resolve(nodes.map(picture => picture.src));
    });
`;

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas)
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@Common.PagesSinglePageJS(pageScript, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klmanga', `KLManga`, 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
