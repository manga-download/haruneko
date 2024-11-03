import { Tags } from '../Tags';
import LezhinBase from './templates/LezhinBase';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-en', 'Lezhin (English)', 'https://www.lezhinus.com', 'en-US', 'en', [Tags.Media.Manga, Tags.Language.English, Tags.Source.Official]);
    }
}