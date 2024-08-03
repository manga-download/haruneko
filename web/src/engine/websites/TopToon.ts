import { Tags } from '../Tags';
import icon from './TopToon.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

// TODO : TEST/CODE LOGIN

const clearMangaLimitScript = `localStorage.removeItem('freeComicCount');`;

type APIComic = {
    id: number,
    idx: string,
    meta: {
        title: string,
        comicsListUrl: string,
    },
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = `/comic/ep_view/${anchor.dataset.comicId}/${anchor.dataset.episodeId}`;
    let title = anchor.querySelector('p.ep_title').textContent.trim();
    const subtitle = anchor.querySelector('p.ep_stitle')?.textContent.trim();
    title += subtitle ? ' - ' + subtitle : '';
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/comic\/ep_list\/[^/]+/, 'div.ep_comic_info span.comic_tit span')
@Common.ChaptersSinglePageCSS('div.eplist ul a.episode-items', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toptoon', `TOPTOON (탑툰)`, 'https://toptoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        //HashTag.list.comic got the filtered manga list. Dont directly fetch the json at HashTag.fileUrl, it has junk mangas
        const data = await FetchWindowScript<APIComic[]>(new Request(new URL('/hashtag', this.URI)), 'HashTag.list.comic', 500);
        return data.map(entry => new Manga(this, provider, entry.meta.comicsListUrl, entry.meta.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await FetchWindowScript(new Request(this.URI), clearMangaLimitScript); //clear free chapter limit
        return Common.FetchPagesSinglePageCSS.call(this, chapter, 'div#viewerContentsWrap img.document_img');
    }

}