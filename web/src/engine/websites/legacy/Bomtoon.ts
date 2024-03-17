import { Exception } from '../../Error';
import { Tags } from '../../Tags';
import { FetchJSON } from '../../platform/FetchProvider';
import { Page, type Chapter } from '../../providers/MangaPlugin';
import { WebsiteResourceKey as R } from '../../../i18n/ILocale';
import icon from './Bomtoon.webp';
import Delitoon, { type APIPages, type APIResult } from './Delitoon';
import * as Common from '../decorators/Common';

@Common.MangasNotSupported()
export default class extends Delitoon {

    public constructor() {
        super('bomtoon', `Bomtoon`, 'https://www.bomtoon.com', 'BOMTOON_COM', [Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official]);
    }

    public override get Icon() {
        return icon;
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
