import { Tags } from '../Tags';
import { WebComicsAppBase } from './templates/WebComicsAppBase';
import icon from './WebComicsApp.webp';

export default class extends WebComicsAppBase {

    public constructor() {
        super('webcomicsapp-en', `WebComicsApp (English)`, 'https://www.webcomicsapp.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
        this.WithLanguageCode('en');
    }

    public override get Icon() {
        return icon;
    }
}