import { Tags } from '../Tags';
import icon from './DelitoonBDE.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('delitoonbde', `Delitoon B (German)`, 'https://www.delitoonb.de', Tags.Language.German, Tags.Media.Manhwa, Tags.Source.Official);
        this.BalconyID = 'DELITOONB_DE';
        this.pagesEndpoint = 'contents/';
    }

    public override get Icon() {
        return icon;
    }
}