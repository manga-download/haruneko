import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { InitManga } from './templates/InitManga';

export default class extends InitManga {

    public constructor() {
        super('merlinscans', 'MerlinToon', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}