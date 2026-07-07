import { Tags } from '../Tags';
import icon from './Ikiru.webp';
import { KiruBase } from './templates/KiruBase';

export default class extends KiruBase {

    public constructor() {
        super('ikiru', 'Ikiru', 'https://06.ikiru.wtf', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}