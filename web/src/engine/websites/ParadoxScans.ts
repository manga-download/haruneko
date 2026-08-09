import { Tags } from '../Tags';
import icon from './ParadoxScans.webp';
import { InitManga } from './templates/InitManga';
export default class extends InitManga {
    public constructor() {
        super('paradoxscans', 'Paradox Scans', 'https://paradoxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}