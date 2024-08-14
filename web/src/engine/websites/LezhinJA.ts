import Lezhin from './templates/Lezhin';
import { Tags } from '../Tags';

export default class LezhinEN extends Lezhin {
    public constructor() {
        super('lezhin-ja', 'Lezhin (Japanese)', 'https://www.lezhin.jp', 'ja-JP', 'ja', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official]);
    }
}