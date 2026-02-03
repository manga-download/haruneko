import { Tags } from '../Tags';
import { LezhinBase } from './templates/LezhinBase';

export default class extends LezhinBase {
    public constructor() {
        super('lezhin-ko', 'Lezhin (Korean)', 'https://www.lezhin.com', [Tags.Media.Manga, Tags.Language.Korean, Tags.Source.Official]);
        this.locale = 'ko-KR';
        this.languagePath = 'ko';
    }
}