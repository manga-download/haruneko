import { Tags } from '../Tags';
import { WebComicsAppBase } from './templates/WebComicsAppBase';
import icon from './WebComicsApp.webp';

export default class extends WebComicsAppBase {

    public constructor() {
        super('webcomicsapp-id', `WebComicsApp (Indonesian)`, 'https://www.webcomicsapp.com', Tags.Language.Indonesian, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
        this.WithLanguageCode('id');
    }

    public override get Icon() {
        return icon;
    }
}