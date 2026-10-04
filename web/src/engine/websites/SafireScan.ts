import { Tags } from '../Tags';
import icon from './SafireScan.webp';
import { ZeistManga } from './templates/ZeistManga';
export default class extends ZeistManga {

    public constructor() {
        super('safirescan', 'Safire Scan', 'https://www.safirescan.site', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}