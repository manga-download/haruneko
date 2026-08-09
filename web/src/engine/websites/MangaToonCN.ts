import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-cn', `MangaToon (Chinese)`, 'https://mangatoon.mobi/cn', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
        this.WithLanguage('cn');
    }

    public override get Icon() {
        return icon;
    }
}