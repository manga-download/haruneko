import { Chapter, type Manga } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './GodaComic.webp';
import { GodaBase } from './templates/GodaBase';
import { FetchCSS } from '../platform/FetchProvider';

export default class extends GodaBase {

    public constructor() {
        super('godacomic', 'GodaComic', 'https://manhuascans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = (await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '#mangachapters')).at(0).dataset.mid;
        const anchors = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`./manga/get?mid=${mangaId}&mode=all`, this.apiURL)), 'div.chapteritem a');
        return anchors.map(({ dataset, pathname }) => new Chapter(this, manga, pathname, dataset.ct.replace(manga.Title, '').trim() || dataset.ct.trim()));
    }

    public override get Icon() {
        return icon;
    }
}