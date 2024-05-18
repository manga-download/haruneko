import { Tags } from '../Tags';
import icon from './FlixScansOrg.webp';
import { Chapter, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import GalaxyManga, { type APIManga, type APIMangaClipboard, type APIChapter, type APIPages } from './GalaxyManga';

@Common.ImageAjax()
export default class extends GalaxyManga {

    public constructor() {
        super('flixscansorg', 'FlixScans (.org)', 'https://flixscans.org', 'https://flixscans.site/api/v1/', 'https://media.flixscans.org', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator]);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = url.match(this.mangaRegexp);
        const request = new Request(`${this.apiUrl}webtoon/series/${matches[2]}/${matches[1]}`);
        const { serie } = await FetchJSON<APIMangaClipboard>(request);
        return new Manga(this, provider, JSON.stringify(<APIManga>{
            id: serie.id,
            prefix: serie.prefix
        }), serie.title);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaID: APIManga = JSON.parse(manga.Identifier);
        const request = new Request(`${this.apiUrl}webtoon/chapters/${mangaID.id}-desc`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chapter => new Chapter(this, manga, chapter.id.toString(), `${chapter.name} ${chapter.title || ''}`.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaID: APIManga = JSON.parse(chapter.Parent.Identifier);
        const request = new Request(`${this.apiUrl}webtoon/chapters/chapter/${chapter.Identifier}/${mangaID.prefix}`);
        const data = await FetchJSON<APIPages>(request);
        return data.chapter.chapterData.webtoon.map(image => new Page(this, chapter, new URL(image, this.cdnUrl)));
    }

}