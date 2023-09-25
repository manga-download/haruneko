import { Tags } from '../../Tags';
import icon from './ComicZerosum.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchProto, FetchRequest } from '../../FetchProvider';

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private api_url = 'https://api.zerosumonline.com/api/v1/';
    private protoTypes = '/src/engine/websites/legacy/ComicZerosum.proto';
    public constructor() {
        super('comiczerosum', `Comic ゼロサム (Comic ZEROSUM)`, 'https://zerosumonline.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /https?:\/\/zerosumonline\.com\/detail\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //'https://api.zerosumonline.com/api/v1/title?tag=
        const mangaid = url.match(/\/detail\/([\w]+)/)[1];
        const requri = new URL(`title?tag=${mangaid}`, this.api_url);
        const responseType = 'ComicZerosum.TitleView';
        const request = new FetchRequest(requri.href);
        const data = await FetchProto(request, this.protoTypes, responseType);
        return new Manga(this, provider, data['title'].tag, data['title'].name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('list?category=series&sort=date', this.api_url);
        const responseType = 'ComicZerosum.Listview';
        const request = new FetchRequest(uri.href);
        const data = await FetchProto(request, this.protoTypes, responseType);
        return data['titles'].map(element => {
            return new Manga(this, provider, element.tag, element.name.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        //'https://api.zerosumonline.com/api/v1/title?tag=
        const uri = new URL(`title?tag=${manga.Identifier}`, this.api_url);
        const responseType = 'ComicZerosum.TitleView';
        const request = new FetchRequest(uri.href);
        const data = await FetchProto(request, this.protoTypes, responseType);
        return data['chapters'].map(chapter => {
            return new Chapter(this, manga, chapter.id, chapter.name.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //https://api.zerosumonline.com/api/v1/viewer?chapter_id=
        const uri = new URL(`viewer?chapter_id=${chapter.Identifier}`, this.api_url);
        const responseType = 'ComicZerosum.MangaViewerView';
        const request = new FetchRequest(uri.href, {
            method: 'POST',
        });
        const data = await FetchProto(request, this.protoTypes, responseType);
        return data['pages'].filter(page => page.imageUrl).map(page => new Page(this, chapter, new URL(page.imageUrl)));
    }
}