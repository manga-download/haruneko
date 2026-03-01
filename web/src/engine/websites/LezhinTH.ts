import { Tags } from '../Tags';
import icon from './LezhinTH.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor() {
        super('boomtoon', 'Lezhin (Thai)', 'https://www.lezhinth.com', Tags.Language.Thai, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetDRM(this.URI, 'BOOMTOON_COM', 'Asia/Bangkok');
    }

    public override get Icon() {
        return icon;
    }
}