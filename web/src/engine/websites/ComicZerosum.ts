import { Tags } from '../Tags';
import icon from './ComicZerosum.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchProto, FetchRequest } from './../FetchProvider';

type APISingleTitle = {
    title: APITitle
}

type APITitles = {
    titles: APITitle[]
}

type APITitle = {
    id: number,
    tag: string,
    name: string
}

type TitleView = {
    title: APITitle,
    chapters: APIChapter[]
}

type APIChapter = {
    id: number,
    name: string,
    imageUrl: string
}

type APIPages = {
    pages: {
        imageUrl: string
    }[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private api_url = 'https://api.zerosumonline.com/api/v1/';
    private protoTypes = `
        package ComicZerosum;
        syntax = "proto3";

        //Common
        message Header {
          optional uint32 lastUpdateTime = 1;
          optional uint32 nextUpdateTime = 2;
        }

        //Mangas
        message Listview {
          optional Header header = 1;
          repeated Title titles = 3;
        }

        message Title {
          optional uint32 id = 1;
          optional string tag = 2;
          optional string name = 3;
          optional string nameKana = 4;
          optional string author = 5;
          optional string authorKana = 6;
          optional string description = 7;
          optional string imgUrl = 8;
          optional uint32 startTime = 9;
          optional uint32 endTime = 10;
          optional bool fanLetterEnable = 11;
          optional bool r18Flag = 12;
          optional Genres genres = 13;
          optional uint32 lastUpdateTime = 14;
          optional uint32 latestChapterId = 15;
        }

        message Genres {
          repeated Genre genre = 1;
        }

        message Genre {
          optional uint32 id = 1;
          optional string name = 2;
        }

        message IndependentBook {
          optional uint32 id = 1;
          optional uint32 titleId = 2;
          optional string name = 3;
          optional string imageUrl = 4;
          optional uint32 releaseTime = 5;
          optional uint32 startTime = 6;
          optional uint32 endTime = 7;
          optional StoreUrls storeUrls = 8;
        }

        message StoreUrls {
          repeated StoreUrl storeUrl = 1;
        }

        message StoreUrl {
          optional int32 store = 1;
          optional string url = 2;
        }

        //Chapter
        message TitleView {
          optional Header header = 1;
          optional Title title = 2;
          repeated Chapter chapters = 3;
          repeated IndependentBook independentBooks =  4;
          repeated TitleRelatedBanner titleRelatedBanners = 5;
          optional Sns sns = 6;
        }



        message Chapter {
          optional uint32 id = 1;
          optional string name = 2;
          optional string imageUrl = 3;
          optional uint32 startTime = 4;
          optional uint32 endTime = 5;
          optional string nextUpdateTime = 6;
          optional bool fanLetterEnabled = 7;
        }


        message TitleRelatedBanners {
          repeated TitleRelatedBanner titleRelatedBanners = 1;
        }

        message TitleRelatedBanner {
          optional string imageUrl = 1;
          optional string url = 2;
        }

        message Sns {
          optional string facebook = 1;
          optional string twitter = 2;
        }

        //Pages

        message MangaViewerView {
          optional int32 status = 1;
          optional uint32 titleId = 2;
          optional string titleTag = 3;
          optional string viewerTitle = 4;
          repeated MangaPage pages = 5;
        }

        message MangaPage {
          optional string imageUrl = 1;
          optional LastPage lastPage = 2;
        }

        message LastPage {
          optional uint32 t = 1;
        }
`;
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
        const mangaid = url.match(/\/detail\/([\w]+)/)[1];
        const requri = new URL(`title?tag=${mangaid}`, this.api_url);
        const request = new FetchRequest(requri.href);
        const data = await FetchProto<APISingleTitle>(request, this.protoTypes, 'ComicZerosum.TitleView');
        return new Manga(this, provider, data.title.tag, data.title.name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const uri = new URL('list?category=series&sort=date', this.api_url);
        const request = new FetchRequest(uri.href);
        const data = await FetchProto<APITitles>(request, this.protoTypes, 'ComicZerosum.Listview');
        return data.titles.map(element => {
            return new Manga(this, provider, element.tag, element.name.trim());
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`title?tag=${manga.Identifier}`, this.api_url);
        const request = new FetchRequest(uri.href);
        const data = await FetchProto<TitleView>(request, this.protoTypes, 'ComicZerosum.TitleView');
        return data.chapters.map(chapter => {
            return new Chapter(this, manga, String(chapter.id), chapter.name.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(`viewer?chapter_id=${chapter.Identifier}`, this.api_url);
        const request = new FetchRequest(uri.href, {
            method: 'POST',
        });
        const data = await FetchProto<APIPages>(request, this.protoTypes, 'ComicZerosum.MangaViewerView');
        return data.pages.filter(page => page.imageUrl).map(page => new Page(this, chapter, new URL(page.imageUrl)));
    }
}
