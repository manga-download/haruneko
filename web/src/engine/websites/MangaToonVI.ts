import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-vi', `MangaToon (Vietnamese)`, 'https://mangatooncom.vn/vi', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Official);
        this.WithLanguage('vi');
    }

    public override get Icon() {
        return icon;
    }
}