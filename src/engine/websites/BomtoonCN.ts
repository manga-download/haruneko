import { Tags } from '../Tags';
import icon from './Bomtoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('bomtooncn', `Bomtoon (Chinese)`, 'https://www.bomtoon.tw', Tags.Language.Chinese, Tags.Media.Manhwa, Tags.Source.Official);
        this.balconyID = 'BOMTOON_TW';
        this.mangaSearchVersion = 2;
    }

    public override get Icon() {
        return icon;
    }
}