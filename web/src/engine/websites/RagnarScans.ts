import { Tags } from '../Tags';
import icon from './RagnarScans.webp';
import { InitManga } from './templates/InitManga';

export default class extends InitManga {

    public constructor() {
        super('ragnarscans', 'Ragnar Scans', 'https://ragnarscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}