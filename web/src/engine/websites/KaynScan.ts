import { Tags } from '../Tags';
import icon from './KaynScan.webp';
import { NovelDexTheme } from './templates/NovelDexTheme';

export default class extends NovelDexTheme {

    public constructor() {
        super('kaynscan', 'Kayn Scan', 'https://kaynscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}