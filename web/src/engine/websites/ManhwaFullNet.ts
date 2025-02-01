import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import { FlatManga } from './templates/FlatManga';
export default class extends FlatManga {

    public constructor() {
        super('manhwafullnet', 'ManhwaFull(.net)', 'https://manhwafull.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}