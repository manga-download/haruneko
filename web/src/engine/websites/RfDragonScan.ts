import { Tags } from '../Tags';
import icon from './RfDragonScan.webp';
import { PeachScan } from './templates/PeachScan';

export default class extends PeachScan {

    public constructor() {
        super('rfdragonscan', 'RF Dragon Scan', 'https://rfdragonscan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}