import { Tags } from '../Tags';
import icon from './Reyume.webp';
import { ZeistManga } from './templates/ZeistManga';

export default class extends ZeistManga {

    public constructor() {
        super('reyume', 'Reyume', 'https://www.re-yume.my.id', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}