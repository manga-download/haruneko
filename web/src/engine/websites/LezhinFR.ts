import { Tags } from '../Tags';
import icon from './LezhinFR.webp';
import { BalconyDRM, DelitoonBase } from './templates/DelitoonBase';
import * as Common from './decorators/Common';

// TODO: Check for possible revision
@Common.MangasNotSupported()
export default class extends DelitoonBase {

    public constructor () {
        super('delitoon', 'Lezhin (French)', 'https://www.lezhinfr.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official);
        this.drm = new BalconyDRM(this.URI, 'LEZHINFR_COM');
    }

    public override get Icon() {
        return icon;
    }
}