import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import {type MangaPlugin, Manga } from '../providers/MangaPlugin';
import icon from './Bomtoon.webp';
import Delitoon, { type APIManga, type APIResult } from './Delitoon';

type APIMangas = {
    content: APIManga[]
}
export default class extends Delitoon {
    public constructor() {
        super('bomtoon', `Bomtoon`, 'https://www.bomtoon.com', 'BOMTOON_COM', [Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official]);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/api/balcony-api/novelwriter/search/contents', this.URI);
        url.search = new URLSearchParams({
            searchText: '',
            isCheckDevice: 'true',
            isIncludeAdult: 'true',
            contentsThumbnailType: 'MAIN',
            size: '99999'
        }).toString();
        const { data } = await FetchJSON<APIResult<APIMangas>>(this.CreateRequest(url));
        return data.content.map(element => new Manga(this, provider, element.alias, element.title.trim()));
    }

}
