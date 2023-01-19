import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS , FetchRequest} from '../FetchProviderNodeWebkit';

@Common.MangaCSS(/^https?:\/\/212\.32\.226\.234\/manga\/[^/]+\/$/, 'section.metadata h1.title', Common.ElementLabelExtractor('span.alter'))
@Common.MangasMultiPageCSS('/komik-list/page/{page}/', '#main .relat div.animepost a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://212.32.226.234', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let uri = new URL(chapter.Identifier, this.URI);
        let request = new FetchRequest(uri.href);
        let data = await FetchCSS(request, "main#reader");
        const chapterid = data[0].dataset['id'];

        uri = new URL('/themes/ajax/ch.php', this.URI);
        request = new FetchRequest(uri.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: : chapterid })
        });
        data = await FetchCSS<HTMLImageElement>(request, 'img');
        return data.map(element => new Page(this, chapter, new URL(element.getAttribute('src'))));
    }
}
