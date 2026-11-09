import { Tags } from '../Tags';
import icon from './LezhinFR.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor () {
        super('delitoon', 'Lezhin (French)', 'https://www.lezhinfr.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official);
        this.SetDRM(this.URI, 'LEZHINFR_COM', 'Europe/Paris');
    }

    public override get Icon() {
        return icon;
    }
}