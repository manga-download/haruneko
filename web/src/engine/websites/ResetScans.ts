import { Tags } from '../Tags';
import icon from './ResetScans.webp';
import { FuzzyDoodle } from './templates/FuzzyDoodle';

export default class extends FuzzyDoodle {

    public constructor() {
        super('resetscans', 'Reset Scans', 'https://reset-scans.xyz', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}