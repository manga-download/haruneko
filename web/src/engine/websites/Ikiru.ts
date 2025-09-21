import { Tags } from '../Tags';
import icon from './Ikiru.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function LabelCleaner(element: HTMLElement): string {
    return element.textContent.replace(/\s+Bahasa\s+Indonesia/i, '').replace(/\s*-\s*Ikiru/, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'title', LabelCleaner)
@Common.MangasMultiPageCSS('div#search-results a:not([class]', Common.PatternLinkGenerator('/project/?the_page={page}'))
@Common.PagesSinglePageCSS('section img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('ikiru', 'Ikiru', 'https://01.ikiru.wtf', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const endpoint = (await FetchCSS<HTMLDivElement>(new Request(new URL(manga.Identifier, this.URI)), 'div#chapter-list')).at(0).getAttribute('hx-get').trim();
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(endpoint)), 'div[data-chapter-number] a');
        return data.map(chapter => {
            const title = chapter.querySelector('span').textContent.trim();
            return new Chapter(this, manga, chapter.pathname, title);
        });
    }
}