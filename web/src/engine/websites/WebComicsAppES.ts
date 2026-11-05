import { Tags } from '../Tags';
import { WebComicsAppBase } from './templates/WebComicsAppBase';
import icon from './WebComicsApp.webp';

export default class extends WebComicsAppBase {

    public constructor() {
        super('webcomicsapp-es', `WebComicsApp (Spanish)`, 'https://www.webcomicsapp.com', Tags.Language.Spanish, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
        this.WithLanguageCode('es');
    }

    public override get Icon() {
        return icon;
    }
}