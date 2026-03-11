import { Tags } from '../Tags';
import icon from './MangaTime.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

function ReplaceNameWithDash(inputString: string): string {
    return inputString.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: `/manga/${ReplaceNameWithDash(anchor.dataset.mangaName.trim())}/`,
        title: anchor.dataset.mangaName.trim()
    };
}

const chapterScript = `
    new Promise( resolve => {
        resolve( [...document.querySelectorAll('a[href*="/chapter"][title]')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.title.trim()
            };
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.anime__details__title h3')
@Common.MangasSinglePageCSS('/categories/0/9999/', 'a.manga-link-3', MangaInfoExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatime', 'MangaTime', 'https://mangatime.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /imageElement\d+\.dataset.src\s*=\s*['"](.*)['"]/ig);
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}