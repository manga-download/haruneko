import { Tags } from '../Tags';
import icon from './Syosetu.webp';
import { Zing92Base } from './templates/Zing92Base';

export default class extends Zing92Base {

    public constructor () {
        super('syosetu', 'Syosetu', 'https://syosetu.ph', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
        this.WithNonceName(undefined)
    }

    public override get Icon() {
        return icon;
    }
}