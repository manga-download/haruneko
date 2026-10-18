import { Tags } from '../Tags';
import icon from './Yukomik.webp';
import { QwikMangas } from './templates/QwikMangas';
export default class extends QwikMangas {

    public constructor() {
        super('yukomik', 'Yukomik', 'https://v1.yukomik.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}