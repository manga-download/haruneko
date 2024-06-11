import LezhinBase from './LezhinBase';
import { Tags } from '../Tags';

export default class LezhinEN extends LezhinBase {
    public constructor() {
        super('lezhin-ja', 'Lezhin (japanese)', 'https://www.lezhin.jp/ja', 'ja-JP', Tags.Language.Japanese);
    }
}