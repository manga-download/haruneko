import { Tags } from '../Tags';
import icon from './ManhwaHentai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type MangaID = {
    post: string,
    slug: string
}

type APIManga = {
    success: boolean,
    data: string;
}

@Madara.MangaCSS(/^{origin}\/pornhwa\/[^/]+\/$/, 'div.post-summary div.post-title')
@Madara.MangasMultiPageCSS('div.post-title a', 0, '/pornhwa/page/{page}/')
@Common.PagesSinglePageJS(`chapter_preloaded_images.map(image => image.src.replace('http://', 'https://'))`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwahentai', 'ManhwaHentai', 'https://manhwahentai.to', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaid: MangaID = JSON.parse(manga.Identifier);
        const url = new URL(`/wp-admin/admin-ajax.php?action=get-all-chapters-list&post_id=${mangaid.post}&chapters_per_page=9999&offset=0`, this.URI);
        const { data } = await FetchJSON<APIManga>(new Request(url));

        const dom = new DOMParser().parseFromString(data, 'text/html');
        const links = [...dom.querySelectorAll<HTMLAnchorElement>('li a')];
        return links.map(chapter => {
            return new Chapter(this, manga, `${mangaid.slug}${chapter.pathname.split('/').pop()}`, chapter.querySelector('p.truncate').textContent.trim());
        }).distinct();
    }

}