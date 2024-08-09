import Lezhin from './templates/Lezhin';
import { Tags } from '../Tags';

export default class LezhinEN extends Lezhin {
    public constructor() {
        super('lezhin-en', 'Lezhin (english)', 'https://www.lezhinus.com', 'en-US', 'en', [Tags.Media.Manga, Tags.Language.English, Tags.Source.Official]);
    }
}