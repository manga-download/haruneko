import { Tags } from '../Tags';
import icon from './MangaOneJp.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import protoTypes from './MangaOneJp.proto?raw';
import { FetchCSS, FetchProto } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type JSONViewerData = {
    chapter_id: number,
    type: string
}

type WebRensaiListResponse = {
    dayOfWeekTitleLists: {
        titles: APITitle[]
    }[]
}

type APITitle = {
    title: {
        titleId: number,
        titleName: string
    }
}

type WebChapterListForViewerResponse = {
    chapterList: WebChapterListUsedByPaging,
    volumeList: WebVolumeListUsedByPaging
}

type WebChapterListUsedByPaging = {
    chapterList: ChapterProto[]
}

type WebVolumeListUsedByPaging = {
    volumeList: Volume[]
}

type ChapterProto = {
    chapterId: number,
    chapterName: string,
    description: string
}

type Volume = {
    volume: {
        id: number,
        name: string
    }
}

type ItemID = {
    id: number
    type: 'chapter' | 'volume',
}

type WebViewerResponse = {
    currentTitle: APITitle,
    pages: PageProto[]
}

type PageProto = {
    image?: {
        imageUrl: string
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://manga-one.com/api/client';

    public constructor() {
        super('mangaonejp', 'Manga One (Japan)', 'https://manga-one.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/viewer/\\d+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        //There is no manga link, user can paste chapter url or volume url (with or without args)
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(url)), 'script:not([src])');
        const { chapter_id, type } = this.ExtractData<JSONViewerData>(scripts, 'chapter_id', 'viewer_type');
        const { currentTitle: { title } } = await this.GetWebViewerResponse(chapter_id, type);
        return new Manga(this, provider, title.titleId.toString(), title.titleName);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { dayOfWeekTitleLists } = await FetchProto<WebRensaiListResponse>(new Request(new URL('?rq=rensai', this.apiUrl)), protoTypes, 'MangaOneJp.WebRensaiListResponse');
        return dayOfWeekTitleLists.reduce((accumulator: Manga[], day) => {
            accumulator.push(...day.titles.map(title => new Manga(this, provider, title.title.titleId.toString(), title.title.titleName)));
            return accumulator;
        }, []);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        let url = new URL(`?rq=viewer/chapter_list&title_id=${manga.Identifier}&page=1&limit=9999&sort_type=desc`, this.apiUrl);

        url.searchParams.set('type', 'chapter');
        const { chapterList: { chapterList } } = await FetchProto<WebChapterListForViewerResponse>(new Request(url), protoTypes, 'MangaOneJp.WebChapterListForViewerResponse');
        chapters.push(...chapterList.map(chapter => {
            const id = JSON.stringify({ id: chapter.chapterId, type: 'chapter' });
            return new Chapter(this, manga, id, [chapter.chapterName, chapter.description].join(' ').trim());
        }));

        url.searchParams.set('type', 'volume');
        const { volumeList: { volumeList } } = await FetchProto<WebChapterListForViewerResponse>(new Request(url), protoTypes, 'MangaOneJp.WebChapterListForViewerResponse');
        chapters.push(...volumeList.map(volume => new Chapter(this, manga, JSON.stringify({ id: volume.volume.id, type: 'volume' }), volume.volume.name)));

        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, type }: ItemID = JSON.parse(chapter.Identifier);

        let data = await this.GetWebViewerResponse(id, type);
        if (!data.pages) {
            data = await this.GetWebViewerResponse(id, type, true);
            if (!data.pages)
                throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return data.pages.filter(page => page.image)
            .map(page => new Page(this, chapter, new URL(page.image.imageUrl)));
    }

    private async GetWebViewerResponse(id: number, type: string, isTrial : boolean = false): Promise<WebViewerResponse> {
        const url = new URL(this.apiUrl);
        url.searchParams.set('rq', type === 'volume' ? 'volume_viewer' : 'viewer');
        url.searchParams.set(type === 'volume' ? 'volume_id_for_read' : 'chapter_id', id.toString());
        url.searchParams.set('viewer_type', type);
        if (isTrial) url.searchParams.set('is_trial', 'true');
        return await FetchProto<WebViewerResponse>(new Request(url, { method: 'POST' }), protoTypes, 'MangaOneJp.WebViewerResponse');
    }

    private ExtractData<T>(scripts: HTMLScriptElement[], scriptMatcher: string, keyName: string, asObject: boolean = true): T {
        const script = scripts.map(script => script.text).find(text => text.includes(scriptMatcher) && text.includes(keyName));
        const content = JSON.parse(script.substring(script.indexOf(',"') + 1, script.length - 2)) as string;
        const record = JSON.parse(content.substring(content.indexOf(':') + 1)) as JSONObject;

        return (function FindValueForKeyName(parent: JSONElement): JSONElement {
            if (parent[keyName]) {
                return asObject ? parent : parent[keyName];
            }
            for (const child of (Object.values(parent) as JSONElement[]).filter(value => value && typeof value === 'object')) {
                const result = FindValueForKeyName(child);
                if (result) {
                    return result;
                }
            }
            return undefined;
        })(record) as T;
    }

}