import { Tags } from '../Tags';
import icon from './Zebrack.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './Zebrack.proto?raw';
import { FetchProto, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/TaskPool';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { GetTypedData } from './decorators/Common';
import { GetBytesFromHex } from '../BufferEncoder';

type ZebrackResponse = {
    titleDetailView: TitleDetailView;
    magazineViewerView: MagazineViewerView;
    magazineBacknumberView: MagazineBacknumberView;
    volumeListView: VolumeListView;
};

type TitleDetailView = {
    titleId: number;
    titleName: string;
};

type ImageV3 = {
    imageUrl: string;
    encryptionKey: string;
};

// Chapter

type TitleChapterListViewV3 = {
    groups: ChapterGroupV3[];
    titleName: string;
};

type ChapterViewerViewV3 = {
    pages: ChapterPageV3[];
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
    pages: VolumePageV3[];
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
    images: ZebrackImage[];
};

type ZebrackImage = {
    imageUrl: string;
    encryptionKey: string;
};

// Gravure

type GravureDetailViewV3 = {
    gravure: GravureV3;
};

type GravureV3 = {
    name: string;
};

type GravureViewerViewV3 = {
    images: ImageV3[];
};

type PageParam = {
    encryptionKey: string;
};

@Common.MangasNotSupported()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api2.zebrack-comic.com';
    private readonly oldApiUrl = 'https://api.zebrack-comic.com';
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
            const { magazine: { name } } = await FetchProto<MagazineDetailViewV3>(new Request(new URL(`./api/v3/magazine_detail?os=browser&magazine_id=${magazineId}`, this.apiURL)), protoTypes, 'Zebrack.MagazineDetailViewV3');
            return new Manga(this, provider, uri.pathname.replace(/\/detail$/, ''), name);

        } else if (/^\/gravure\//.test(uri.pathname)) {
            const gravureId = uri.pathname.match(/\/gravure\/(\d+)/).at(1);
            const { gravure: { name } } = await FetchProto<GravureDetailViewV3>(new Request(new URL(`./api/v3/gravure_detail?os=browser&gravure_id=${gravureId}`, this.apiURL)), protoTypes, 'Zebrack.GravureDetailViewV3');
            return new Manga(this, provider, uri.pathname, name);
        }

        const titleId = uri.pathname.match(/\/title\/(\d+)/).at(1);
        const { titleDetailView: { titleName } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./api/browser/title_detail?os=browser&title_id=${titleId}`, this.apiURL)), protoTypes, this.responseRootType);
        return new Manga(this, provider, uri.pathname, titleName);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [, mangaType, mangaId] = manga.Identifier.split('/');
        switch (mangaType) {
            case 'title': {
                // Grab chapters
                const { groups } = await FetchProto<TitleChapterListViewV3>(new Request(new URL(`./api/v3/title_chapter_list?os=browser&title_id=${mangaId}`, this.apiURL)), protoTypes, 'Zebrack.TitleChapterListViewV3');
                const chapters = groups.reduce((chaptersAccumulator: Chapter[], currentGroup) => {
                    const groupChapters = currentGroup.chapters.map(({ id, mainName }) => new Chapter(this, manga, `chapter/${id}`, mainName.replace(manga.Title, '').trim()));
                    chaptersAccumulator.push(...groupChapters);
                    return chaptersAccumulator;
                }, []);

                // Grab volumes
                const { volumeListView: { volumes } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./api/browser/title_volume_list?os=browser&title_id=${mangaId}`, this.apiURL)), protoTypes, this.responseRootType);
                const mangaVolumes = volumes.map(({ volumeId, volumeName }) => new Chapter(this, manga, `volume/${volumeId}`, volumeName.replace(manga.Title, '').trim()));
                return [...chapters, ...mangaVolumes];
            }

            case 'magazine': {
                type This = typeof this;
                return Array.fromAsync(async function* (this: This) {
                    for (let year = new Date().getFullYear(), run = true; run; year--) {
                        const { magazineBacknumberView: { issues } } = await FetchProto<ZebrackResponse>(new Request(new URL(`./api/browser/magazine_backnumbers?os=browser&magazine_id=${mangaId}&year=${year}`, this.oldApiUrl)), protoTypes, this.responseRootType);
                        const magazines = !issues ? [] : issues.map(({ issueId, issueName }) => new Chapter(this, manga, `${mangaType}/${issueId}`, issueName));
                        magazines.length > 0 ? yield* magazines : run = false;
                    }

                }.call(this));
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
                const { pages } = await this.FetchViewer<ChapterViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.ChapterViewerViewV3');
                if (pages) {
                    return pages?.filter(page => page.image?.imageUrl)
                        .map(({ image: { imageUrl, encryptionKey } }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey }));
                }
            }

            case 'gravure': {
                let data = await this.FetchViewer<GravureViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.GravureViewerViewV3');
                if (!data.images) data = await this.FetchViewer<GravureViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.GravureViewerViewV3', true);
                if (data.images) {
                    return data.images.map(({ imageUrl, encryptionKey }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey }));
                };
                break;
            }

            case 'magazine': {
                let data = await this.FetchViewer<ZebrackResponse>(type, mangaId, chapterId, secretKey, this.responseRootType);
                if (!data.magazineViewerView) data = await this.FetchViewer<ZebrackResponse>(type, mangaId, chapterId, secretKey, this.responseRootType, true);
                if (data.magazineViewerView?.images) {
                    return data.magazineViewerView.images?.filter(page => page.imageUrl)
                        .map(({ imageUrl, encryptionKey }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey }));
                }
                break;
            }

            case 'volume': {
                let data = await this.FetchViewer<VolumeViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.VolumeViewerViewV3');
                if (!data.pages) data = await this.FetchViewer<VolumeViewerViewV3>(type, mangaId, chapterId, secretKey, 'Zebrack.VolumeViewerViewV3', true);
                if (data.pages) {
                    return data.pages.filter(page => page.image?.imageUrl)
                        .map(({ image: { imageUrl, encryptionKey } }) => new Page<PageParam>(this, chapter, new URL(imageUrl), { encryptionKey }));
                }
                break;
            }
        }

        throw new Exception(R.Plugin_Common_Chapter_InvalidError);
    }

    private async FetchViewer<T extends JSONElement>(type: string, mangaId: string, issueId: string, secretKey: string, message: string, isTrial: boolean = false): Promise<T> {
        const searchParams = new URLSearchParams({
            secret: secretKey,
            'is_trial': isTrial ? '1' : '0',
            os: 'browser'
        });

        let url: URL = new URL('./api/v3/chapter_viewer', this.apiURL);;
        switch (type) {
            case 'chapter': {
                searchParams.delete('is_trial');
                searchParams.set('title_id', mangaId);
                searchParams.set('chapter_id', issueId);
                searchParams.set('type', 'normal');
                return FetchProto<T>(new Request(url, {
                    method: 'POST',
                    body: searchParams.toString(),
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }), protoTypes, message);
            }

            case 'volume': {
                searchParams.set('title_id', mangaId);
                searchParams.set('volume_id', issueId);
                url = new URL('./api/v3/manga_volume_viewer', this.apiURL);
                break;
            }

            case 'magazine': {
                searchParams.set('magazine_id', mangaId);
                searchParams.set('magazine_issue_id', issueId);
                url = new URL('./api/browser/magazine_viewer', this.oldApiUrl);
                break;
            }

            case 'gravure': {
                searchParams.set('gravure_id', mangaId);
                url = new URL('./api/v3/gravure_viewer', this.apiURL);
                break;
            }
        };

        url.search = searchParams.toString();
        return await FetchProto<T>(new Request(url), protoTypes, message);
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
}