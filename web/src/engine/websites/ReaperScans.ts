import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, type Manga } from '../providers/MangaPlugin';
import icon from './ReaperScans.webp';
import { HeanCMS, type APIChapter, type APIResult, type APIMediaID } from './templates/HeanCMS';
export default class extends HeanCMS {

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
        this.mediaUrl = 'https://media.reaperscans.com/file/4SRBHm';
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { id } = JSON.parse(manga.Identifier) as APIMediaID;
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`/chapters/${id}?perPage=9999`, this.apiUrl)));
        return data.map(item => new Chapter(this, manga, JSON.stringify({ id: item.id.toString(), slug: item.chapter_slug }), [item.chapter_name, item.chapter_title || ''].join(' ').trim()));
    }

    public override get Icon() {
        return icon;
    }
}
