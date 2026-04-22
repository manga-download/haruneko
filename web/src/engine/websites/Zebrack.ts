import { Tags } from '../Tags';
import icon from './Zebrack.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './Zebrack.proto?raw';
import { FetchProto, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { GetTypedData } from './decorators/Common';
import { GetBytesFromHex } from '../BufferEncoder';

type ZebrackResponse = {
    titleDetailView?: TitleDetailView;
    magazineViewerView?: MagazineViewerView;
    magazineBacknumberView?: MagazineBacknumberView;
    volumeListView?: VolumeListView;
};

type TitleDetailView = {
    titleId: number;
    titleName: string;
};

type ImageV3 = {
    imageUrl?: string;
    encryptionKey: string;
};

type PageParam = {
    encryptionKey: string;
};

// Chapter

type TitleChapterListViewV3 = {
    groups?: ChapterGroupV3[];
    titleName: string;
};

type ChapterViewerViewV3 = {
    pages?: ChapterPageV3[];
};

type ChapterGroupV3 = {
    chapters: ChapterV3[];
};

type ChapterV3 = {
    id: number;
    mainName: string;
};

type ChapterPageV3 = {
    image: ImageV3;
};

// Volume

type VolumeListView = {
    volumes: Volume[];
};

type VolumeViewerViewV3 = {
    pages?: VolumePageV3[];
};

type VolumePageV3 = {
    image: ImageV3;
};

type Volume = {
    volumeId: number;
    volumeName: string;
};

// Magazine

type MagazineDetailViewV3 = {
    magazine: Magazine;
};

type MagazineBacknumberView = {
    issues: MagazineIssue[];
    issuesYear: number;
    tabs: number[];
};

type Magazine = {
    magazineId: number;
    name: string;
};

type MagazineIssue = {
    issueId: number;
    issueName: string;
};

type MagazineViewerView = {
    images: ImageV3[];
};

// Gravure

type GravureDetailViewV3 = {
    gravure: GravureV3;
};

type GravureV3 = {
    id: number;
    name: string;
};

type GravureViewerViewV3 = {
    images: ImageV3[];
};

// Search

type SearchResultViewV3 = {
    mangas?: SearchResultViewV3Item[];
};

type SearchResultViewV3Item = {
    transitionUrl: string;
    mainText: string;
};

type GravureListViewV3 = {
    gravures?: GravureV3[];
};

export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api2.zebrack-comic.com/api/';
    private readonly oldApiUrl = 'https://api.zebrack-comic.com/api/';
    private readonly responseRootType = 'Zebrack.Response';

    public constructor() {
        super('zebrack', 'Zebrack(ゼブラック)', 'https://zebrack-comic.shueisha.co.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/(title|gravure|magazine)/\\d+(\/detail)?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        if (/^\/magazine\//.test(uri.pathname)) {
            const magazineId = uri.pathname.match(/\/magazine\/(\d+)/).at(1);
            const { magazine: { name } } = await FetchProto<MagazineDetailViewV3>(new Request(new URL(`./v3/magazine_detail?os=browser&magazine_id=${magazineId}`, this.apiURL)), protoTypes, 'Zebrack.MagazineDetailViewV3');
            return new Manga(this, provider, uri.pathname.replace(/\/detail$/, ''), name);

        } else if (/^\/gravure\//.test(uri.pathname)) {
            const gravureId = uri.pathname.match(/\/gravure\/(\d+)/).at(1);
            const { gravure: { name } } = await FetchProto<GravureDetailViewV3>(new Request(new URL(`./v3/gravure_detail?os=browser&gravure_id=${gravureId}`, this.apiURL)), protoTypes, 'Zebrack.GravureDetailViewV3');
            return new Manga(this, provider, uri.pathname, name);
        }

        const titleId = uri.pathname.match(/\/title\/(\d+)/).at(1);
        const { titleDetailView: { titleName } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./browser/title_detail?os=browser&title_id=${titleId}`, this.apiURL)), protoTypes, this.responseRootType);
        return new Manga(this, provider, uri.pathname, titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const results: Manga[] = [];

        for (const character of '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
            ///search mangas & magazines
            const { mangas: mangasData } = await FetchProto<SearchResultViewV3>(new Request(new URL(`./v3/title_search?os=browser&search_order=related&keyword=${character}`, this.apiURL)), protoTypes, 'Zebrack.SearchResultViewV3');

            //Urls use custom protocol i.e garaku://magazine_detail?magazineId=1"
            const mangas = !mangasData ? [] : mangasData.map(({ mainText, transitionUrl }) => {
                const url = new URL(transitionUrl);
                return new Manga(this, provider, url.searchParams.has('magazineId') ? `/magazine/${url.searchParams.get('magazineId')}` : `/title/${url.searchParams.get('titleId')}`, mainText);
            });
            results.push(...mangas);

            ///search gravures
            const { gravures: gravuresData } = await FetchProto<GravureListViewV3>(new Request(new URL(`./v3/gravure_search?os=browser&keyword=${character}&search_order=related`, this.oldApiUrl)), protoTypes, 'Zebrack.GravureListViewV3');
            const gravures = !gravuresData ? [] : gravuresData.map(({ id, name }) => new Manga(this, provider, `/gravure/${id}`, name));
            results.push(...gravures);
        }
        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [, mangaType, mangaId] = manga.Identifier.split('/');
        switch (mangaType) {
            case 'title': {
                // Grab chapters
                const { groups } = await FetchProto<TitleChapterListViewV3>(new Request(new URL(`./v3/title_chapter_list?os=browser&title_id=${mangaId}`, this.apiURL)), protoTypes, 'Zebrack.TitleChapterListViewV3');
                const chapters = !groups ? [] : groups.reduce((chaptersAccumulator: Chapter[], currentGroup) => {
                    const groupChapters = currentGroup.chapters.map(({ id, mainName }) => new Chapter(this, manga, `chapter/${id}`, this.ReplaceNotEmpty(mainName, manga.Title)));
                    chaptersAccumulator.push(...groupChapters);
                    return chaptersAccumulator;
                }, []);

                // Grab volumes
                const { volumeListView: { volumes } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./browser/title_volume_list?os=browser&title_id=${mangaId}`, this.apiURL)), protoTypes, this.responseRootType);
                const mangaVolumes = volumes.map(({ volumeId, volumeName }) => new Chapter(this, manga, `volume/${volumeId}`, this.ReplaceNotEmpty(volumeName, manga.Title)));
                return [...chapters, ...mangaVolumes];
            }

            case 'magazine': {
                // gather years
                const { magazineBacknumberView: { tabs: years } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./browser/magazine_backnumbers?os=browser&magazine_id=${mangaId}&year=`, this.oldApiUrl)), protoTypes, this.responseRootType);

                //fetch all years
                const promises = years.map(async (year: number) => {
                    const { magazineBacknumberView: { issues } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./browser/magazine_backnumbers?os=browser&magazine_id=${mangaId}&year=${year}`, this.oldApiUrl)), protoTypes, this.responseRootType);
                    return !issues ? [] : issues.map(({ issueId, issueName }) => new Chapter(this, manga, `${mangaType}/${issueId}`, this.ReplaceNotEmpty(issueName, manga.Title)));
                });
                return (await Promise.all(promises)).flat();
            }

            case 'gravure': {
                return [new Chapter(this, manga, `${mangaType}/${mangaId}`, manga.Title)];
            }

            default: {
                return [];
            }
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [type, chapterId] = chapter.Identifier.split('/');
        const [, , mangaId] = chapter.Parent.Identifier.split('/');
        const secretKey = await FetchWindowScript<string>(new Request(this.URI), `localStorage.getItem('device_secret_key') || ''`);

        switch (type) {
            case 'chapter': {
                const { pages } = await this.FetchViewer<ChapterViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.ChapterViewerViewV3', () => true);
                return pages?.filter(page => page.image?.imageUrl)
                    .map(({ image: { imageUrl, encryptionKey } }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey })) ?? [];
            }

            case 'gravure': {
                const { images } = await this.FetchViewer<GravureViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.GravureViewerViewV3', data => 'images' in data);
                return images?.map(({ imageUrl, encryptionKey }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey })) ?? [];
            }

            case 'magazine': {
                const { magazineViewerView } = await this.FetchViewer<ZebrackResponse>(type, mangaId, chapterId, secretKey, this.responseRootType, data => data.magazineViewerView?.images);
                return magazineViewerView.images?.filter(page => page.imageUrl)
                    .map(({ imageUrl, encryptionKey }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey })) ?? [];
            }

            case 'volume': {
                const { pages } = await this.FetchViewer<VolumeViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.VolumeViewerViewV3', data => 'pages' in data);
                return pages?.filter(page => page.image?.imageUrl)
                    .map(({ image: { imageUrl, encryptionKey } }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey })) ?? [];
            }
        }
    }

    /**
     * Fetch (& optionaly validate) viewer data using Protobuff. Retry with "trial" parameter in case validation doesnt pass
     * @param type - Media type : volume, magazine, gravure, chapter
     * @param mangaId - Manga identifier
     * @param issueId - Issue identifier ( chapter id, volume id, magazine issue id, etc..)
     * @param secretKey - secret key from localstorage
     * @param message - Protobuff type returned 
     * @param predicate - function used to validate request results
     */
    private async FetchViewer<T extends JSONElement>(type: string, mangaId: string, issueId: string, secretKey: string, message: string, predicate: (data: T) => unknown) {
        const payload = await this.#FetchViewerData<T>(type, mangaId, issueId, secretKey, message, false);
        return predicate(payload) ? payload : await this.#FetchViewerData<T>(type, mangaId, issueId, secretKey, message, true);
    }

    async #FetchViewerData<T extends JSONElement>(type: string, mangaId: string, issueId: string, secretKey: string, message: string, isTrial: boolean = false): Promise<T> {
        const searchParams = new URLSearchParams({
            secret: secretKey,
            'is_trial': isTrial ? '1' : '0',
            os: 'browser'
        });

        let url = new URL('./v3/chapter_viewer', this.apiURL);
        switch (type) {
            case 'chapter': {
                searchParams.delete('is_trial');
                return FetchProto<T>(new Request(url, {
                    method: 'POST',
                    body: new URLSearchParams([
                        ...searchParams,
                        ['title_id', mangaId],
                        ['chapter_id', issueId],
                        ['type', 'normal'],
                    ]).toString(),
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }), protoTypes, message);
            }

            case 'volume': {
                url = new URL(`./v3/manga_volume_viewer?title_id=${mangaId}&volume_id=${issueId}`, this.apiURL);
                break;
            }

            case 'magazine': {
                url = new URL(`./browser/magazine_viewer?magazine_id=${mangaId}&magazine_issue_id=${issueId}`, this.oldApiUrl);
                break;
            }

            case 'gravure': {
                url = new URL(`./v3/gravure_viewer?gravure_id=${mangaId}`, this.apiURL);
                break;
            }
        }
        searchParams.forEach((value, key) => url.searchParams.set(key, value));
        return FetchProto<T>(new Request(url), protoTypes, message);
    }

    public override async FetchImage(page: Page<PageParam>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters.encryptionKey ? blob : this.DecryptImage(blob, page.Parameters.encryptionKey);
    }

    private async DecryptImage(blob: Blob, key: string): Promise<Blob> {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const xorkey = new Uint8Array(GetBytesFromHex(key));
        for (let n = 0; n < bytes.length; n++)
            bytes[n] = bytes[n] ^ xorkey[n % xorkey.length];
        return GetTypedData(bytes.buffer);
    }

    private ReplaceNotEmpty(source: string, replaceFrom: string): string {
        return source.replace(replaceFrom, '').trim() || source;
    }
}