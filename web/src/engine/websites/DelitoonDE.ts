import { Tags } from '../Tags';
import icon from './DelitoonDE.webp';
import { BalconyDRM, DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor() {
        super('delitoonde', `Delitoon (German)`, 'https://www.delitoon.de', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'DELITOON_DE';
        this.mangaSearchVersion = 2;
        this.drm = new BalconyDRM(this.URI, 'DELITOON_DE');
    }

    public override get Icon() {
        return icon;
    }
}