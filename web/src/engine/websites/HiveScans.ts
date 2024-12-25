import { Tags } from '../Tags';
import icon from './HiveScans.webp';
import { Iken } from './templates/Iken';

export default class extends Iken {

    public constructor() {
        super('hivescans', 'Hive Scans', 'https://hivetoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}