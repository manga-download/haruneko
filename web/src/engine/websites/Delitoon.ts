import { Tags } from '../Tags';
import icon from './Delitoon.webp';
import { BalconyDRM, DelitoonBase } from './templates/DelitoonBase';

// TODO: Check for possible revision

export default class extends DelitoonBase {

    public constructor () {
        super('delitoon', 'Delitoon', 'https://www.delitoon.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official);
        this.drm = new BalconyDRM(this.URI, 'DELITOON_COM');
    }

    public override get Icon() {
        return icon;
    }
}