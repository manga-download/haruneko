import { Tags } from '../Tags';
import icon from './PornhwaPro.webp';
import { QwikMangas } from './templates/QwikMangas';
export default class extends QwikMangas {

    public constructor() {
        super('pornhwapro', 'Pornhwa (.pro)', 'https://pornhwa.pro', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Rating.Pornographic);
        this.SetConfig({ mangaKey: '8ywboZ3XmY8', pagesKey: 'OAPu60mnlmU', mangaListFunc: 'Ss0x03l9L1w', mangaListEndpoint: '/manhwa-list/' });
    }

    public override get Icon() {
        return icon;
    }
}