import { Tags } from '../Tags';
import icon from './HiveScans.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('hivescans', 'Hive Scans', 'https://hivetoons.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://api.hivetoons.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}