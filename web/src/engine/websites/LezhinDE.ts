import { Tags } from '../Tags';
import icon from './LezhinDE.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor () {
        super('delitoonde', 'Lezhin (German)', 'https://www.lezhinde.com', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetDRM(this.URI, 'LEZHINDE_COM', 'Europe/Berlin');
    }

    public override get Icon() {
        return icon;
    }
}