import { Tags } from '../Tags';
import icon from './InariManga.webp';
import { Kozaku } from './templates/Kozaku';

export default class extends Kozaku {

    public constructor() {
        super('inarimanga', 'InariManga', 'https://inarimanga.rzhost.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}