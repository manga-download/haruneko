import { Tags } from '../Tags';
import icon from './ValirScans.webp';
import { NovelDexTheme } from './templates/NovelDexTheme';

export default class extends NovelDexTheme {

    public constructor() {
        super('valirscans', 'Valir Scans', 'https://valirscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}