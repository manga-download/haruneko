import { Tags } from '../Tags';
import icon from './OlimpoScans.webp';
import { type Chapter, Page } from '../providers/MangaPlugin';
import { FlatManga } from './templates/FlatManga';

export default class extends FlatManga {
    public constructor() {
        super('olimposcans', `OlimpoScans`, 'https://leerolimpo.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await super.FetchPages.call(this, chapter);
        return pages.map(page => new Page(this, chapter, this.StripSearch(page.Link), page.Parameters));
    }

    private StripSearch(link: URL): URL {
        link.pathname = link.pathname.replace(/&.*/g, '');
        return link;
    }
}
