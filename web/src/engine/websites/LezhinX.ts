import { Tags } from '../Tags';
import icon from './LezhinX.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor() {
        super('lezhinx', 'Lezhin X', 'https://www.lezhinx.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetDRM(this.URI, 'LEZHINX_COM', 'America/Los_Angeles').WithSearchVersion(1);
    }

    public override get Icon() {
        return icon;
    }
}