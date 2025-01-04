import { Tags } from '../Tags';
import icon from './MangaRaw1001.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

type APIPages = {
    html: string;
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS('/all-manga/{page}', MojoPortalComic.queryMangas)
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters, anchor => { return { id: anchor.dataset.id, title: anchor.innerText.trim() }; })
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaraw1001', 'MangaRaw1001', 'https://mangaraw1001.cc', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL('/ajax/image/list/chap/' + chapter.Identifier, this.URI));
        const { html } = await FetchJSON<APIPages>(request);
        const images = new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLImageElement>('div.page-chapter img');
        return [ ...images ].map(image => new Page(this, chapter, new URL(image.dataset.original || image.dataset.real || image.src)));
    }
}