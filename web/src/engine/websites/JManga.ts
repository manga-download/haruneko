import { Tags } from '../Tags';
import icon from './JManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Liliana from './decorators/Liliana';

const pageScript = `
    new Promise(resolve => {
        const elementid = '#' + manga.lang + '-chapters li[data-number="'+ manga.name +'"]';
        const chapterid = document.querySelector(elementid).dataset.id;
        $.get(
            "/json/chapter", {
                id: chapterid
            },
            function(j) {
                if (j.status == 1) {
                    const dom = new DOMParser().parseFromString(j.html, 'text/html');
                    resolve([...dom.querySelectorAll('div.iv-card img')].map(image => image.dataset.src));
                } else reject();
            },
            "json"
        );
    })
`;

@Common.MangaCSS(/^{origin}\/read\/[^/]+-raw\/$/, Liliana.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('/raw-manga/?p={page}', Liliana.queryMangas, 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div.chapters-list-ul ul li.item a.item-link', Common.AnchorInfoExtractor(true) )
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jmanga', 'JManga', 'https://jmanga.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Japanese, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

}