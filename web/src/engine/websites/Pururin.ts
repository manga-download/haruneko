import { Tags } from '../Tags';
import icon from './Pururin.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import {FetchCSS } from '../platform/FetchProvider';

type JsonImg = {
    directory: string,
        images: {
            page: number,
            filename: string
        }[]
}

function MangaInfoExTractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('img.card-img-top').getAttribute('alt').trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/gallery\/\d+\//, 'div.title h1 span')
@Common.MangasMultiPageCSS('/browse/title?page={page}', 'a.card.card-gallery', 1, 1, 0, MangaInfoExTractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pururin', `Pururin`, 'https://pururin.to', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.gallery-action a:first-of-type'); //button "Read Online"
        return [new Chapter(this, manga, data[0].pathname, 'Chapter')];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new Request(uri.href);
        const data = await FetchCSS(request, '.img-viewer');
        const imgdata: JsonImg = JSON.parse(data[0].dataset['img']);
        const server = data[0].dataset['svr'];
        const directory = imgdata.directory;
        return imgdata.images.map(page => new Page(this, chapter, new URL(`${directory}/${page.filename}`, server)));

    }

}