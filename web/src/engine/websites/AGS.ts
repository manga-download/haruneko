import { Tags } from '../Tags';
import icon from './AGS.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('ags', 'AGR (Animated Glitched Comics)', 'https://agrcomics.org', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://api.agrcomics.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}