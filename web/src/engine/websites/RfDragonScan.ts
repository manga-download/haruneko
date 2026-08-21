import { Tags } from '../Tags';
import icon from './RfDragonScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('rfdragonscan', 'RF Dragon Scan', 'https://rfdragonscan.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}