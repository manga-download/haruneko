import { Tags } from '../Tags';
import icon from './Reyume.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'meta[property="og:title"]')
export default class extends ZeistManga {

    public constructor() {
        super('reyume', 'Reyume', 'https://www.re-yume.my.id', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
        this.WithMangaSlugScript(`document.querySelector('div#clwd script').text.match(/run\\(['"](.*)['"]/).at(1)`);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [html] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), '#zeist-raw-data');
        return [...new DOMParser().parseFromString(html.textContent, 'text/html').querySelectorAll<HTMLImageElement>('div.separator a img')]
            .map(img => new Page(this, chapter, new URL(PageLinkExtractor(img))));

    }
}