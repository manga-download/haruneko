import { Tags } from '../Tags';
import { LezhinBase } from './templates/LezhinBase';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-ja', 'Lezhin (Japanese)', 'https://www.lezhin.jp', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official]);
        this.locale = 'ja-JP';
        this.languagePath = 'ja';
    }
}