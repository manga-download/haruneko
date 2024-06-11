import LezhinBase from './LezhinBase';
import { Tags } from '../Tags';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-en', 'Lezhin (english)', 'https://www.lezhinus.com/en', 'en-US', Tags.Language.English);
    }
}