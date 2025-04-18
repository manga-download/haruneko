import { Tags } from '../Tags';
import icon from './HiveScans.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('hivescans', 'Hive Scans', 'https://hivecomic.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}