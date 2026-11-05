import { Tags } from '../Tags';
import { WebComicsAppBase } from './templates/WebComicsAppBase';
import icon from './WebComicsApp.webp';

export default class extends WebComicsAppBase {

    public constructor() {
        super('webcomicsapp-pt', `WebComicsApp (Portuguese)`, 'https://www.webcomicsapp.com', Tags.Language.Portuguese, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
        this.WithLanguageCode('pt');
    }

    public override get Icon() {
        return icon;
    }
}