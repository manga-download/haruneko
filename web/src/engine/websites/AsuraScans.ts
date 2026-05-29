import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

const pagesScript = `
    new Promise(resolve => {
        const element = document.querySelector('astro-island[component-url*="ChapterReader"]');
        element.hydrator = () => (_, props) => {
            resolve(props.pages.map(( { url }) => url)); 
        };
        element.hydrate();
    });
`;

const chapterScript = `
    new Promise( resolve => {
        const element = document.querySelector('astro-island[component-url*="ChapterListReact"]');
        resolve(JSON.parse(element.getAttribute('props')).chapters[1].map(chapter => {
            return {
               id: '/comics/'+ chapter[1].series_slug[1] + '/chapter/'+ chapter[1].number[1],
               title : ['Chapter', chapter[1].number[1], chapter[1].title?.at(1)].join(' ').trim()
            };
        }));
    });
`;

function CleanPathName(uri: URL | HTMLAnchorElement) {
    return uri.pathname.replace(/-[a-f0-9]+$/, '');
};

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'article h1', (element, uri) => ({ id: CleanPathName(uri), title: element.textContent.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#series-grid div.series-card div a', Common.PatternLinkGenerator('/browse?page={page}'), 0, anchor => ({ id: CleanPathName(anchor), title: anchor.textContent.trim() }))
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@MangaStream.PagesSinglePageJS(excludes, pagesScript, 1000)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asurascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}