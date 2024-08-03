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
        const url = new URL('/api/balcony-api/search/all', this.URI);
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            url.search = new URLSearchParams({
                searchText: character,
                isCheckDevice: 'true',
                isIncludeAdult: 'true',
                contentsThumbnailType: 'MAIN',
                size: '9999'
            }).toString();
            return FetchJSON<APIResult<APIMangas>>(this.CreateRequest(url));
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.data.content.map(element => new Manga(this, provider, element.alias, element.title.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
        return results.distinct();
    }

}
