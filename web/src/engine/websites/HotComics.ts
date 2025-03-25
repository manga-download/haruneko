import { Tags } from '../Tags';
import icon from './HotComics.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Toomics from './decorators/ToomicsBase';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';

@Toomics.MangaCSS(/^{origin}\/[a-z]+\/[^/]+\/[^/]+\.html$/, 'div.title_content h2.episode-title')
@Toomics.MangasSinglePageCSS(['en', 'de', 'jp', 'ch', 'tc', 'mx', 'es', 'it', 'por', 'fr', 'ko'], 'div.list-wrap ul li a', '/{language}/ranking/')
@Common.PagesSinglePageCSS(Toomics.queryPages, Toomics.PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('hotcomics', `HotComics`, 'https://hotcomics.me', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await FetchWindowScript(new Request(new URL('/en/index/set_display/?display=A', this.URI)), '');//allow +18 content (for all languages)
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterRegexp = /\/[a-z]+\/[^/]+\/episode[^/]+\.html/;
        const mangaTitle = manga.Title.replace(/\[.+\]$/, '').trim();
        const elements = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'ol.list-ep li.normal_ep a');
        return elements.map(element => {
            let id = element.pathname;
            if (!chapterRegexp.test(id)) id = element.getAttribute('onclick').match(chapterRegexp).at(0);
            const title = [
                element.querySelector<HTMLDivElement>('div.cell-title strong').textContent.trim(),
                element.querySelector<HTMLDivElement>('div.cell-num').textContent.trim()
            ].join(' ').replace(mangaTitle, '').trim();
            return new Chapter(this, manga, id, title);
        });
    }

}