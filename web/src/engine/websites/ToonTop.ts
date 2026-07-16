import { Tags } from '../Tags';
import icon from './ToonTop.webp';
import { MangakBase } from './templates/MangakBase';

export default class extends MangakBase {

    public constructor() {
        super('toontop', 'ToonTop', 'https://toontop.io', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}