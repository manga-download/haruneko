import { Tags } from '../Tags';
import icon from './LezhinES.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('lezhin-es', `Lezhin (Spanish)`, 'https://www.lezhin.es', Tags.Language.Spanish, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'LEZHIN_ES';
        this.mangaSearchVersion = 2;
    }

    public override get Icon() {
        return icon;
    }
}