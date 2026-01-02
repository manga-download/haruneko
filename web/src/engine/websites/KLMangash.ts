import { Tags } from '../Tags';
import icon from './KLMangash.webp';
import { Zing92Base } from './templates/Zing92Base';

export default class extends Zing92Base {

    public constructor () {
        super('klmangash', 'KLManga(.sh)', 'https://klmanga.sale', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
        this.decodeImageAjaxAction = 'decode_images_g';
        this.zingParamsScript = `new Promise(resolve => resolve({ nonce: zing.nonce_a, apiURL: zing.ajax_url }));`;
        this.nonceParameterName = 'nonce_a';
    }

    public override get Icon() {
        return icon;
    }
}