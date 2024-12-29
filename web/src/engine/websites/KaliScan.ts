import { Tags } from '../Tags';
import icon from './KaliScan.webp';
import { MadTheme } from './templates/MadTheme';

export default class extends MadTheme {

    public constructor() {
        super('kaliscan', `KaliScan`, 'https://kaliscan.io', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}