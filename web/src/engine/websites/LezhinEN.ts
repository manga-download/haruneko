import { Tags } from '../Tags';
import { LezhinBase } from './templates/LezhinBase';

export default class extends LezhinBase {
    public constructor() {
        super('lezhin-en', 'Lezhin (English)', 'https://www.lezhinus.com', [Tags.Media.Manga, Tags.Language.English, Tags.Source.Official]);
        this.WithLocale('en-US').WithPathSegment('en');
    }
}