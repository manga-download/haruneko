import { Tags } from '../Tags';
import icon from './Delitoon.webp';
import { DelitoonBase } from './templates/DelitoonBase';

export default class extends DelitoonBase {
    public constructor() {
        super('delitoon', 'Delitoon', 'https://www.delitoon.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Official);

    }

    public override get Icon() {
        return icon;
    }
}