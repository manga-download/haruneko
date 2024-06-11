import LezhinBase from './LezhinBase';
import { Tags } from '../Tags';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-ko', 'Lezhin (korean)', 'https://www.lezhin.com/ko', 'ko-KR', Tags.Language.Korean);
    }
}