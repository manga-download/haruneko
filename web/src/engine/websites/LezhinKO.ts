import Lezhin from './templates/Lezhin';
import { Tags } from '../Tags';

export default class LezhinEN extends Lezhin {
    public constructor() {
        super('lezhin-ko', 'Lezhin (korean)', 'https://www.lezhin.com', 'ko-KR', 'ko', [Tags.Media.Manga, Tags.Language.Korean, Tags.Source.Official]);
    }
}