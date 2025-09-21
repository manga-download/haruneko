import { Tags } from '../Tags';
import icon from './DayComicsME.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Toomics from './decorators/ToomicsBase';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/en\/[^/]+\/[^/]+\.html$/, 'div.title_content h2.episode-title')
@Common.MangasMultiPageCSS('div.list-wrap ul li a', Common.PatternLinkGenerator('/en/genres?page={page}'), 0, Toomics.MangaInfoExtractor(false))
@Common.PagesSinglePageCSS(Toomics.queryPages, Toomics.PageExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('daycomicsme', 'DayComics(.me)', 'https://daycomics.me', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(this.URI), 'window.cookieStore.set("hc_vfs", "Y");');//allow +18 content
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterRegexp = /\/[a-z]+\/[^/]+\/episode[^/]+\.html/;
        const mangaTitle = manga.Title.replace(/\[.+\]$/, '').trim();
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'ol.list-ep li.normal_ep a');
        return elements.map(element => {
            let id = element.pathname;
            if (!chapterRegexp.test(id)) id = element.getAttribute('onclick').match(chapterRegexp).at(0);
            const title = [
                element.querySelector<HTMLDivElement>('div.cell-num').textContent.trim(),
                element.querySelector<HTMLDivElement>('div.cell-title strong').textContent.trim()
            ].join(' ').replace(mangaTitle, '').trim();
            return new Chapter(this, manga, id, title);
        });
    }

}