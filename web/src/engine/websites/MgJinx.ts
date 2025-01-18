import { Tags } from '../Tags';
import icon from './MgJinx.webp';
import { MadTheme } from './templates/MadTheme';

export default class extends MadTheme {

    public constructor() {
        super('mgjinx', 'MGJINX', 'https://mgjinx.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}