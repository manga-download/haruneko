import { Tags } from '../Tags';
import icon from './DesireScans.webp';
import { NovelDexTheme } from './templates/NovelDexTheme';

export default class extends NovelDexTheme {

    public constructor() {
        super('desirescans', 'Desire Scans', 'https://desirescans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}