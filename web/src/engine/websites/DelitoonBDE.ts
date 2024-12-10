import { Exception } from '../Error';
import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import icon from './DelitoonBDE.webp';
import { DelitoonBase, type APIResult, type APIPages } from './templates/DelitoonBase';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

export default class extends DelitoonBase {
    public constructor() {
        super('delitoonbde', `Delitoon B (German)`, 'https://www.delitoonb.de', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.BalconyID = 'DELITOONB_DE';
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await this.UpdateToken();
        const url = new URL(`contents/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { result, error, data } = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(url));
        if (result == 'ERROR') {
            switch (error.code) {
                case 'NOT_LOGIN_USER':
                case 'UNAUTHORIZED_CONTENTS':
                    throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
            }
        }
        return data.images.map(element => new Page(this, chapter, new URL(element.imagePath)));
    }

}