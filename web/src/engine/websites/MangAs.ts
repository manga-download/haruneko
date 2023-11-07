import { Tags } from '../Tags';
import icon from './MangAs.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';
import type { Priority } from '../taskpool/DeferredTask';

const chapterScript = `
    new Promise((resolve, reject) => {
        const path = window.location.pathname +'/';
        resolve(jschaptertemp.map(chapter =>  { 
            return {
                id : path + chapter.slug,
                title : chapter.number + ' : ' + chapter.name.trim() 
            }}));
    });
`;

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('title').trim()
    };
}

@Common.MangaCSS(/^https?:\/\/mangas\.in\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@Common.MangasMultiPageCSS('/filterList?page={page}&sortBy=name', 'div.media a.thumbnail', 1, 1, 500, MangaExtractor )
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangas', `MangAs`, 'https://mangas.in', Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const server1 = 's1.mangas.in/uploads/manga';
        const server2 = 's2.mangas.in/uploads/manga';

        const blob = await Common.FetchImageElement.call(this, page, priority, signal);
        if (blob.type.startsWith('image/')) return blob;

        page.Link.href = page.Link.href.includes(server1) ? page.Link.href.replace(server1, server2) : page.Link.href.replace(server2, server1);
        return Common.FetchImageElement.call(this, page, priority, signal);
    }

}
