import { Tags } from '../Tags';
import icon from './GodaManhua.webp';
import { GodaBase } from './templates/GodaBase';

export default class extends GodaBase {

    public constructor() {
        super('godamanhua', 'GodaManhua', 'https://baozimh.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
        this.WithApiURL(new URL('https://v2.apikk.top/api/'));
    }

    public override get Icon() {
        return icon;
    }
}
