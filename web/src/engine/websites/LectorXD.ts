import { Tags } from '../Tags';
import icon from './LectorXD.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise(resolve => { debugger;
        const element = document.querySelector('astro-island[component-url*="ChapterList"]');
        element.hydrator = () => (_, props) => {
            resolve(props.chapters.map(chapter => {
                const title = ['Capítulo', chapter.chapter].join(' ').trim();
                return { id: location.pathname + '/leer/' + chapter.chapter, title};
            }));
        };
        element.hydrate();
    });
`;

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/(manga|manhwa|manhua|novela)\/[^/]+/, 'section img.object-cover', (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.manga-grid > a', Common.PatternLinkGenerator('/catalogo?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('h4[title]').getAttribute('title').trim()
}))
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS('div#reader-content img.page-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lectorxd', 'LectorXD', 'https://lectorxd.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}