import { Tags } from '../Tags';
import icon from './MangaTek.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise(resolve => {
        const element = document.querySelector('astro-island[component-url*="MangaChaptersLoader"]');
        element.hydrator = () => (_, props) => {
            resolve(props.manga.MangaChapters.map(chapter => {
                const title = chapter.title ? chapter.title : ['Chapter', chapter.chapter_number].join(' ');
                return { id: '/reader/' + location.pathname.split('/').at(-1) + '/' + chapter.chapter_number, title};
            }));
        };
        element.hydrate();
    });
`;

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'img#mangaCover', (img, url) => ({ id: url.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS('div.manga-card a[dir]', Common.PatternLinkGenerator('/manga-list?page={page}'))
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageCSS('div.manga-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatek', 'MangaTek', 'https://mangatek.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}