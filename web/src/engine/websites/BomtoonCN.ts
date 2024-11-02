import { Tags } from '../Tags';
import icon from './Bomtoon.webp';
import Delitoon from './Delitoon';
export default class extends Delitoon {
    public constructor() {
        super('bomtooncn', `Bomtoon (Chinese)`, 'https://www.bomtoon.tw', [Tags.Language.Chinese, Tags.Media.Manhwa, Tags.Source.Official]);
        this.BalconyID = 'BOMTOON_TW';
    }
    public override get Icon() {
        return icon;
    }
}