import { Tags } from '../Tags';
import icon from './Pururin.webp';
import { type Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import {FetchJSON, FetchRequest } from './../FetchProvider';

type APIChapter = {
    gallery: { total_pages: number, image_extension : string, title: string }
}

const CDN = 'https://cdn.pururin.to/assets/images/data';
const apiPath = '/api/contribute/gallery/info';

function MangaInfoExTractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('img.card-img-top').getAttribute('alt').trim();
    return { id, title };
}

@Common.MangasMultiPageCSS('/browse/title?page={page}', 'a.card.card-gallery', 1, 1, 0, MangaInfoExTractor)
@Common.ChaptersUniqueFromManga()
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pururin', `Pururin`, 'https://pururin.to', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/pururin\.to/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaID = url.match(/\/gallery\/([0-9]+)/)[1];
        const req = new URL(apiPath, this.URI);
        const request = this.getApiRequest(req.href, mangaID);
        const data = await FetchJSON<APIChapter>(request);
        const title = data.gallery.title;
        const id = new URL(url).pathname;
        return new Manga(this, provider, id, title);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID = chapter.Identifier.match(/\/gallery\/([0-9]+)/)[1];
        const uri = new URL(apiPath, this.URI);
        const request = this.getApiRequest(uri.href, mangaID);
        const data = await FetchJSON<APIChapter>(request);
        const pagesMax = data.gallery.total_pages;
        const extension = data.gallery.image_extension;
        //https://cdn.pururin.to/assets/images/data/<mangaid>/<i>.image_extension
        return [...new Array(pagesMax).keys()].map(page => {
            return new Page(this, chapter, new URL(`${CDN}/${mangaID}/${page + 1}.${extension}`));
        });

    }

    private getApiRequest(url: string, id: string): FetchRequest {
        const params = {
            id: id,
            type: 2
        };
        return new FetchRequest(url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'x-origin': this.URI.href,
                'x-referer': this.URI.href,
                'Content-Type': 'application/json;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            }
        });

    }
}