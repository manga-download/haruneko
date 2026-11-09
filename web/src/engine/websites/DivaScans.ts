import { Tags } from '../Tags';
import icon from './DivaScans.webp';
import { NovelDexTheme } from './templates/NovelDexTheme';

export default class extends NovelDexTheme {

    public constructor() {
        super('divascans', 'Diva Scans', 'https://divascans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}