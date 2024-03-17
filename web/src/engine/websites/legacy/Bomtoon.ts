import { Exception } from '../../Error';
import { Tags } from '../../Tags';
import { FetchJSON } from '../../platform/FetchProvider';
import { Page, type Chapter, type MangaPlugin, Manga } from '../../providers/MangaPlugin';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import icon from './Bomtoon.webp';
import Delitoon, { type APIManga, type APIPages, type APIResult } from './Delitoon';
//import * as Common from '../decorators/Common';

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
        const { data } = await FetchJSON<APIResult<APIMangas>>(this.createRequest(url));
        return data.content.map(element => new Manga(this, provider, element.alias, element.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await this.getToken();
        const url = new URL(`/api/balcony-api-v2/contents/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
        url.searchParams.set('isNotLoginAdult', 'true');
        const apiresult = await FetchJSON<APIResult<APIPages>>(this.createRequest(url));
        if (apiresult.result == 'ERROR') {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return apiresult.data.images.map(element => new Page(this, chapter, new URL(element.imagePath)));

    }

}
