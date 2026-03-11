import { Tags } from '../Tags';
import icon from './Bomtoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {

    public constructor () {
        super('bomtoon', `Bomtoon`, 'https://www.bomtoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'BOMTOON_COM';
        this.mangaSearchVersion = 2;
    }

    public override get Icon() {
        return icon;
    }
}