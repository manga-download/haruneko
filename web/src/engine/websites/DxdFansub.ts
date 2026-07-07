import { Tags } from '../Tags';
import icon from './DxdFansub.webp';
import { InitManga } from './templates/InitManga';

export default class extends InitManga {
    public constructor() {
        super('dxdfansub', 'DxD Fansub', 'https://dxdfansub.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}