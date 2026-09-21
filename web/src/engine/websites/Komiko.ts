import { Tags } from '../Tags';
import icon from './Komiko.webp';
import { MeianBase } from './templates/MeianBase';

export default class extends MeianBase {

    public constructor() {
        super('meianplus', 'Komiko', 'https://www.komiko.io', Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
        this.SetParameters({
            apiURL: 'https://api.komiko.io/v2/',
            imageCDN: 'https://ebook.komiko.io/',
            tokenCookieName: 'token_meian_plus',
            additionalHeaders: {
                'X-Client-Platform': 'web',
                'X-Client-Version': '2.0.1',
            }
        });
    }

    public override get Icon() {
        return icon;
    }
}