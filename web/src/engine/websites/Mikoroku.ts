import { Tags } from '../Tags';
import icon from './Mikoroku.webp';
import { ZeistManga } from './templates/ZeistManga';

export default class extends ZeistManga {

    public constructor() {
        super('mikoroku', 'Mikoroku', 'https://www.mikoroku.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}