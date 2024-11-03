import { Tags } from '../Tags';
import { LezhinBase } from './templates/LezhinBase';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-ko', 'Lezhin (Korean)', 'https://www.lezhin.com', 'ko-KR', 'ko', [Tags.Media.Manga, Tags.Language.Korean, Tags.Source.Official]);
    }
}