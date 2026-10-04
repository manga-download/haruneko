import { Tags } from '../Tags';
import icon from './Bomtoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor () {
        super('bomtoon', 'Bomtoon', 'https://www.bomtoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
        this.SetDRM(this.URI, 'BOMTOON_COM', 'Asia/Seoul');
    }

    public override get Icon() {
        return icon;
    }
}