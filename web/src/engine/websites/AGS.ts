import { Tags } from '../Tags';
import icon from './AGS.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('ags', 'AGR (Animated Glitched Comics)', 'https://agrcomics.org', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}