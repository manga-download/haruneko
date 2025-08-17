import { Tags } from '../Tags';
import icon from './LezhinDE.webp';
import { BalconyDRM, DelitoonBase } from './templates/DelitoonBase';

// TODO: Check for possible revision

export default class extends DelitoonBase {

    public constructor () {
        super('delitoonde', 'Lezhin (German)', 'https://www.lezhinde.com', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'LEZHINDE_COM';
        this.mangaSearchVersion = 2;
        this.drm = new BalconyDRM(this.URI, 'LEZHINDE_COM');
    }

    public override get Icon() {
        return icon;
    }
}