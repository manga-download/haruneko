import { Tags } from '../Tags';
import icon from './Syosetu.webp';
import { Zing92Base } from './templates/Zing92Base';

export default class extends Zing92Base {

    public constructor () {
        super('syosetu', 'Syosetu', 'https://syosetu.fi', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
        this.WithDecodeImageAction('decode_images_100');
    }

    public override get Icon() {
        return icon;
    }
}