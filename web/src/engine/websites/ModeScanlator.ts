import { Tags } from '../Tags';
import icon from './ModeScanlator.webp';
import { HeanCMS } from './templates/HeanCMS';

export default class extends HeanCMS {

    public constructor() {
        super('modescanlator', `Mode Scanlator`, 'https://site.modescanlator.net', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
        this.apiUrl = this.URI.origin.replace('site', 'api');
    }

    public override get Icon() {
        return icon;
    }
}