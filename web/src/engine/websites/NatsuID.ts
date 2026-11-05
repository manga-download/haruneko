import { Tags } from '../Tags';
import icon from './NatsuID.webp';
import { KiruBase } from './templates/KiruBase';

export default class extends KiruBase {

    public constructor() {
        super('natsuid', 'NatsuID', 'https://natsu.one', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese);
    }

    public override get Icon() {
        return icon;
    }
}