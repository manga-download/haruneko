import { Tags } from '../Tags';
import icon from './DuManwu.webp';
import RuManhua from './RuManhua';

export default class extends RuManhua {

    public constructor () {
        super('dumanwu', 'DuManwu', 'https://dumanwu.com', [ Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator ]);
        this.queryManga = 'h1.banner-title';
    }

    public override get Icon() {
        return icon;
    }
}