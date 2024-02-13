import { Tags } from '../Tags';
import icon from './ManhuaScan.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MadTheme from './decorators/MadTheme';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.manga-list div.title h3 a', 1)
@MadTheme.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuascan', `ManhuaScan`, 'https://manhuascan.io', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid = manga.Identifier.match(/\/manga\/(\d+)-/)[1];
        const uri = new URL(`/service/backend/chaplist/?manga_id=${mangaid}`, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.chapter-list li a');
        return data.map(element => new Chapter(this, manga, element.pathname, element.querySelector('strong.chapter-title').textContent.trim()));
    }

}