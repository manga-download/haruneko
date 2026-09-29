import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-th', `MangaToon (Thai)`, 'https://mangatoon.mobi/th', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Official);
        this.WithLanguage('th');
    }

    public override get Icon() {
        return icon;
    }
}