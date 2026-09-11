import { Tags } from '../Tags';
import { WebComicsAppBase } from './templates/WebComicsAppBase';
import icon from './WebComicsApp.webp';

export default class extends WebComicsAppBase {

    public constructor() {
        super('webcomicsapp-fr', `WebComicsApp (French)`, 'https://www.webcomicsapp.com', Tags.Language.French, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
        this.WithLanguageCode('fr');
    }

    public override get Icon() {
        return icon;
    }
}